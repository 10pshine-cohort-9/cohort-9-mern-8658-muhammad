import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import refreshJwtConfig from './config/refresh-jwt.config';
import { UserService } from '../user/user.service';
import type { ConfigType } from '@nestjs/config';
import { CurrentUser } from './types/current-user';
import * as argon2 from 'argon2';
import { compare } from 'bcrypt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthJwtPayload } from './types/auth-jwtPayload';
import { JwtService } from '@nestjs/jwt';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtServices: JwtService,
    @Inject(refreshJwtConfig.KEY)
    private readonly refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,
    private readonly logger: PinoLogger,
  ) {}

  async validateJwtUser(userId: string) {
    try {
      const user = await this.userService.findOne(userId);
      const currentUser: CurrentUser = { id: user.id };
      return currentUser;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error(
        {
          err: error,
          userId,
        },
        'JWT user validation failed',
      );

      throw new InternalServerErrorException('Authentication failed');
    }
  }

  async validateRefreshToken(userId: string, refreshToken: string) {
    try {
      const user = await this.userService.findOne(userId);
      if (!user.hashRefreshToken) {
        this.logger.warn(
          { userId },
          'Refresh token validation failed: no stored token',
        );
        throw new UnauthorizedException('Invalid Refresh Token');
      }

      const matchRefreshToken = await argon2.verify(
        user.hashRefreshToken,
        refreshToken,
      );
      if (!matchRefreshToken) {
        this.logger.warn(
          { userId },
          'Refresh token validation failed: invalid token',
        );
        throw new UnauthorizedException('Invalid Refresh Token');
      }

      return { id: user.id };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error(
        {
          err: error,
          userId,
        },
        'Refresh token validation failed',
      );

      throw new InternalServerErrorException('Authentication failed');
    }
  }

  async validateUser(email: string, password: string) {
    try {
      const user = await this.userService.findOneByEmail(email);
      const isMatch = await compare(password, user.passwordHash);
      if (!isMatch) {
        this.logger.warn('User authentication failed: invalid credentials');
        throw new UnauthorizedException('Invalid credentials');
      }
      return { id: user.id };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error({ err: error }, 'User authentication failed');

      throw new InternalServerErrorException('Authentication failed');
    }
  }

  async signUp(createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.create(createUserDto);
      this.logger.info({ userId: user.id }, 'User signed up successfully');
      return user;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      this.logger.error({ err: error }, 'User signup failed');

      throw new InternalServerErrorException('Failed to create a user');
    }
  }

  async signin(userId: string) {
    try {
      const { accessToken, refreshToken } = await this.generateToken(userId);
      const hashedRefreshToken = await argon2.hash(refreshToken);
      await this.userService.updateRefreshToken(userId, hashedRefreshToken);
      this.logger.info({ userId }, 'User signed in successfully');
      return { id: userId, accessToken, refreshToken };
    } catch (error) {
      this.logger.error(
        {
          err: error,
          userId,
        },
        'User sign-in failed',
      );
      throw new InternalServerErrorException('Failed to sign in');
    }
  }

  async generateToken(userId: string) {
    try {
      const payload: AuthJwtPayload = { sub: userId };
      const [accessToken, refreshToken] = await Promise.all([
        this.jwtServices.signAsync(payload),
        this.jwtServices.signAsync(payload, this.refreshTokenConfig),
      ]);
      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      this.logger.error(
        {
          err: error,
          userId,
        },
        'Token generation failed',
      );

      throw new InternalServerErrorException('Failed to generate tokens');
    }
  }

  async refreshToken(userId: string) {
    try {
      const { accessToken, refreshToken } = await this.generateToken(userId);
      const hashedRefreshToken = await argon2.hash(refreshToken);
      await this.userService.updateRefreshToken(userId, hashedRefreshToken);
      this.logger.info({ userId }, 'Access token refreshed successfully');

      return { id: userId, accessToken, refreshToken };
    } catch (error) {
      this.logger.error(
        {
          err: error,
          userId,
        },
        'Failed to refresh access token',
      );
      throw new InternalServerErrorException(
        'Failed to validate refresh token',
      );
    }
  }

  async signOut(userId: string) {
    try {
      await this.userService.updateRefreshToken(userId, null);
      this.logger.info({ userId }, 'User signed out successfully');
      return { message: 'Signed out successfully' };
    } catch (error) {
      this.logger.error(
        {
          err: error,
          userId,
        },
        'User sign-out failed',
      );
      throw new InternalServerErrorException('Failed to Sign out');
    }
  }
}
