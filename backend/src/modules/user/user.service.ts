import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
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
    try {
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
      const { passwordHash, hashRefreshToken, ...result } = user;
      return result;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async findOneByEmail(email: string) {
    try {
      const user = await this.userRepo.findOne({
        where: { email: email.toLowerCase().trim() },
      });
      if (!user) throw new UnauthorizedException('User not found !');
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch user');
    }
  }

  async findAll() {
    try {
      const users = await this.userRepo.find();
      return users.map(({ passwordHash, hashRefreshToken, ...rest }) => rest);
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.userRepo.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }

  async userProfile(id: string) {
    try {
      const user = await this.userRepo.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const { passwordHash, hashRefreshToken, ...result } = user;
      return result;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
    try {
      await this.findOne(userId);

      const updateuser = await this.userRepo.update(userId, updateUserDto);
      if (updateuser.affected === 0) {
        throw new BadRequestException('No record was updated');
      }
      const { passwordHash, hashRefreshToken, ...result } =
        await this.findOne(userId);
      return result;
    } catch (error) {
      throw new InternalServerErrorException('Failed to Update Profile');
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);
      await this.userRepo.delete(id);

      return { message: 'User deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Failed to Delete Profile');
    }
  }

  async updateRefreshToken(userId: string, hashedRefreshToken: string | null) {
    try {
      return await this.userRepo.update(
        { id: userId },
        { hashRefreshToken: hashedRefreshToken },
      );
    } catch (error) {
      throw new InternalServerErrorException('Failed to update token');
    }
  }
}
