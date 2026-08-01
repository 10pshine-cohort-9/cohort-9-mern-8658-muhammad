import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepo.findOne({
      where: {
        email: createUserDto.email.toLowerCase().trim(),
      },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    const user = this.userRepo.create({
      name: createUserDto.name,
      email: createUserDto.email.toLowerCase().trim(),
      passwordHash: createUserDto.password,
    });
    await this.userRepo.save(user);
const { passwordHash, hashRefreshToken, ...result } =
      user

    return result ;
  }

  async findOneByEmail(email:string){
    const user=await this.userRepo.findOne({where:{email:email}})
    if(!user) throw new UnauthorizedException("User not found !")
      return user;

  }

  async findAll() {
    const user = await this.userRepo.find();
    return user;
  }

  async findOne(id: string) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async userProfile(id:string){ 
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const {passwordHash,hashRefreshToken,...result}=user
    return result;

  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
    await this.findOne(userId);

    const updateuser = await this.userRepo.update(userId, updateUserDto);
    if (updateuser.affected === 0) {
      throw new BadRequestException('No record was updated');
    }
    const { passwordHash, hashRefreshToken, ...result } =
      await this.findOne(userId);

    return result;
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.userRepo.delete(id);

    return { message: 'User deleted successfully' };
  }

  async updateRefreshToken(userId:string,hashedRefreshToken:string | null){
return await this.userRepo.update({id:userId},{hashRefreshToken:hashedRefreshToken})
  }
}
