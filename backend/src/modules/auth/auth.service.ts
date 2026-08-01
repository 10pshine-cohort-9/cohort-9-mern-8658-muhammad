import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import refreshJwtConfig from './config/refresh-jwt.config';
import { UserService } from '../user/user.service';
import type { ConfigType } from '@nestjs/config';
import { CurrentUser } from './types/current-user';
import * as argon2 from "argon2"
import { compare } from 'bcrypt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthJwtPayload } from './types/auth-jwtPayload';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
 constructor(
  private readonly userService:UserService,
  private jwtServices:JwtService,
  @Inject(refreshJwtConfig.KEY) private refreshTokenConfig:ConfigType<typeof refreshJwtConfig>,
 ){}

 async validateJwtUser(userId:string){
  const user=await this.userService.findOne(userId);
  const currentUser:CurrentUser ={id:user.id}
  return currentUser;
 }

async validateRefreshToken(userId:string,refreshToken:string){
  const user=await this.userService.findOne(userId);
  if(!user.hashRefreshToken){
    throw new UnauthorizedException("Invalid Refresh Token")
  }

  const matchRefreshToken=await argon2.verify(user.hashRefreshToken,refreshToken )
if(!matchRefreshToken) throw new UnauthorizedException("Invalid Refresh Token")

  return {id:user.id}

}


async validateUser(email:string,password:string){
  const user =await this.userService.findOneByEmail(email)
  const isMatch=await compare(password,user.passwordHash)
  if(!isMatch) throw new UnauthorizedException("Invalid credentials")
    return {id:user.id}
}


async signUp(createUserDto:CreateUserDto){
  const user =await this.userService.create(createUserDto)
  return user

}

async signin(userId:string){
const {accessToken,refreshToken}=await this.generateToken(userId)
const hashedRefreshToken=await argon2.hash(refreshToken)
await this.userService.updateRefreshToken(userId,hashedRefreshToken)
return {id:userId,accessToken,refreshToken}
}


async generateToken(userId:string){
const payload:AuthJwtPayload={sub:userId}
const [accessToken,refreshToken]=await Promise.all([
  this.jwtServices.signAsync(payload),
  this.jwtServices.signAsync(payload,this.refreshTokenConfig)
])
return {
  accessToken,refreshToken
}
}






async refreshToken(userId:string){
  const {accessToken,refreshToken}= await this.generateToken(userId)
  const hashedRefreshToken=await argon2.hash(refreshToken)
  await this.userService.updateRefreshToken(userId,hashedRefreshToken)
return {id:userId,accessToken,refreshToken}
}




async signOut(userId:string){
  await this.userService.updateRefreshToken(userId,null)
}



}

