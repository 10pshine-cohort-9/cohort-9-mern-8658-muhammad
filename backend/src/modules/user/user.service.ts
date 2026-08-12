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
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly logger: PinoLogger,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const existingUser = await this.userRepo.findOne({
        where: {
          email: createUserDto.email.toLowerCase().trim(),
        },
      });

      if (existingUser) {
        this.logger.warn('User registration attempt with existing email');
        throw new ConflictException('Email already exists');
      }
      const user = this.userRepo.create({
        name: createUserDto.name,
        email: createUserDto.email.toLowerCase().trim(),
        passwordHash: createUserDto.password,
      });
      const savedUser = await this.userRepo.save(user);
      this.logger.info(
        {
          userId: savedUser.id,
        },
        'User created successfully',
      );

      const { passwordHash, hashRefreshToken, ...result } = user;
      return result;
    } catch (error) {
      if (error.code === '23505') {
        this.logger.warn('User registration failed: duplicate email');

        throw new ConflictException('Email already exists');
      }

      if (error instanceof ConflictException) {
        throw error;
      }
      this.logger.error(
        {
          err: error,
        },
        'Failed to create user',
      );

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
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error({ err: error }, 'Failed to fetch user by email');

      throw new InternalServerErrorException('Failed to fetch user');
    }
  }

  async findAll() {
    try {
      const users = await this.userRepo.find();
      return users.map(({ passwordHash, hashRefreshToken, ...rest }) => rest);
    } catch (error) {
      this.logger.error({ err: error }, 'Failed to fetch users');

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
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        {
          err: error,
          userId: id,
        },
        'Failed to fetch user',
      );
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
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        {
          err: error,
          userId: id,
        },
        'Failed to fetch user profile',
      );
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
      this.logger.info(
        {
          userId,
        },
        'User profile updated',
      );
      return result;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        this.logger.error(
          {
            err: error,
            userId,
          },
          'Failed to update user profile',
        );

        throw error;
      }
      throw new InternalServerErrorException('Failed to update user profile');
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);
      await this.userRepo.delete(id);

      return { message: 'User deleted successfully' };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      this.logger.error(
        {
          err: error,
          userId: id,
        },
        'Failed to delete user',
      );

      throw new InternalServerErrorException('Failed to Delete Profile');
    }
  }

  async updateRefreshToken(userId: string, hashedRefreshToken: string | null) {
    try {
      const result = await this.userRepo.update(
        { id: userId },
        { hashRefreshToken: hashedRefreshToken },
      );
      if (result.affected === 0) {
        throw new NotFoundException('User not found');
      }
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        {
          err: error,
          userId,
        },
        'Failed to update refresh token',
      );
      throw new InternalServerErrorException('Failed to update token');
    }
  }
}
