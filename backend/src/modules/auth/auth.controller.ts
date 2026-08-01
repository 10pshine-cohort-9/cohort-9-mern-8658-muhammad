import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LocalStrategy } from './strategies/local.strategy';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { RefreshJwtStrategy } from './strategies/refresh.strategy';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth/local-auth.gurad';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Post()
  // create(@Body() createAuthDto: CreateAuthDto) {
  //   return this.authService.create(createAuthDto);
  // }

  // @Get()
  // findAll() {
  //   return this.authService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }

@Public()
@UseGuards(LocalAuthGuard)
@Post("signin")
 signin(@Req() req){
  return this.authService.signin(req.user.id)
}

@Public()
@Post("signup")
 signup(@Body() userDto:CreateUserDto){
  return this.authService.signUp(userDto)
}

@Public()
@UseGuards(RefreshAuthGuard)
@Post("refresh")
refresh(@Req() req){
  return this.authService.refreshToken(req.user.id)
}


@UseGuards(JwtAuthGuard)
@Post("signout")
signout(@Req() req){
  return this.authService.signOut(req.user.id)
} 


  
}
