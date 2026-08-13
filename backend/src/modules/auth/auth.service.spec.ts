import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { AuthService } from './auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import refreshJwtConfig from './config/refresh-jwt.config';
import { PinoLogger } from 'nestjs-pino';

import {
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

import * as argon2 from 'argon2';
import { compare } from 'bcrypt';

jest.mock('argon2', () => ({
  verify: jest.fn(),
  hash: jest.fn(),
}));

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

const mockedArgon2 = jest.mocked(argon2);

describe('Auth Service', () => {
  let service: AuthService;

  let mockUserService = {
    findOne: jest.fn(),
    findOneByEmail: jest.fn(),
    create: jest.fn(),
    updateRefreshToken: jest.fn(),
  };

  const mockJwtService = { signAsync: jest.fn() };
  const mockRefreshTokenConfig = { secret: 'refresh-secret', expiresIn: '7d' };
  const mockLogger = { info: jest.fn(), error: jest.fn(), warn: jest.fn() };

  beforeEach(async () => {
    let module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: refreshJwtConfig.KEY,
          useValue: mockRefreshTokenConfig,
        },
        {
          provide: PinoLogger,
          useValue: mockLogger,
        },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate JWT user', async () => {
    const userid = 'abcd-1234-0000-11111';
    const user = { id: userid };

    mockUserService.findOne.mockResolvedValue(user);
    const result = await service.validateJwtUser(userid);

    expect(mockUserService.findOne).toHaveBeenCalledWith(userid);
    expect(result).toEqual(user);
  });

  it('should throw the Unauthorized Exception when jwt user is not authorized', async () => {
    const userid = 'abcd-1234-0000-11111';

    mockUserService.findOne.mockRejectedValue(new UnauthorizedException());

    await expect(service.validateJwtUser(userid)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(mockUserService.findOne).toHaveBeenCalledWith(userid);
  });

  it('should throw the Internal Exception when jwt failed', async () => {
    const userid = 'abcd-1234-0000-11111';

    mockUserService.findOne.mockRejectedValue(new Error('Database Error'));

    await expect(service.validateJwtUser(userid)).rejects.toThrow(
      InternalServerErrorException,
    );
    expect(mockUserService.findOne).toHaveBeenCalledWith(userid);
  });

  it('should validate refresh token', async () => {
    const userId = 'abcd-1234';
    const refreshToken = 'refresh-token';
    const user = { id: userId, hashRefreshToken: 'hashed-refresh-token' };
    mockUserService.findOne.mockResolvedValue(user);
    mockedArgon2.verify.mockResolvedValue(true);

    const result = await service.validateRefreshToken(userId, refreshToken);
    expect(mockUserService.findOne).toHaveBeenCalledWith(userId);
    expect(mockedArgon2.verify).toHaveBeenCalledWith(
      user.hashRefreshToken,
      refreshToken,
    );
    expect(result).toEqual({ id: userId });
  });

  it('should throw Unauthorized Exception when refresh token is not stored', async () => {
    const userId = 'abcd-1234';
    const user = { id: userId, hashRefreshToken: null };
    mockUserService.findOne.mockResolvedValue(user);
    await expect(
      service.validateRefreshToken(userId, 'refresh-token'),
    ).rejects.toThrow(new UnauthorizedException('Invalid Refresh Token'));
    expect(mockLogger.warn).toHaveBeenCalled();
  });

  it('should throw Unauthorized Exception when refresh token is invalid', async () => {
    const userId = 'abcd-1234';
    const user = { id: userId, hashRefreshToken: 'hashed-refresh-token' };
    mockUserService.findOne.mockResolvedValue(user);
    mockedArgon2.verify.mockResolvedValue(false);
    await expect(
      service.validateRefreshToken(userId, 'wrong-refresh-token'),
    ).rejects.toThrow(new UnauthorizedException('Invalid Refresh Token'));
    expect(mockLogger.warn).toHaveBeenCalled();
  });

  it('should validate user credentials', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    const user = { id: 'abcd-1234', passwordHash: 'hashed-password' };
    mockUserService.findOneByEmail.mockResolvedValue(user);

    (compare as jest.Mock).mockResolvedValue(true);
    const result = await service.validateUser(email, password);
    expect(mockUserService.findOneByEmail).toHaveBeenCalledWith(email);
    expect(result).toEqual({ id: user.id });
  });
  it('should throw UnauthorizedException for invalid credentials', async () => {
    const email = 'test@example.com';
    const password = 'wrong-password';
    const user = { id: 'abcd-1234', passwordHash: 'hashed-password' };
    mockUserService.findOneByEmail.mockResolvedValue(user);

    (compare as jest.Mock).mockResolvedValue(false);
    await expect(service.validateUser(email, password)).rejects.toThrow(
      new UnauthorizedException('Invalid credentials'),
    );
    expect(mockLogger.warn).toHaveBeenCalled();
  });
  it('should throw InternalServerErrorException when user validation fails', async () => {
    mockUserService.findOneByEmail.mockRejectedValue(
      new Error('Database error'),
    );
    await expect(
      service.validateUser('test@example.com', 'password'),
    ).rejects.toThrow(InternalServerErrorException);
    expect(mockLogger.error).toHaveBeenCalled();
  });

  it('should sign up a user', async () => {
    const createUserDto = {
      email: 'test@example.com',
      password: 'password123',
    };
    const user = { id: 'abcd-1234', email: 'test@example.com' };
    mockUserService.create.mockResolvedValue(user);
    const result = await service.signUp(createUserDto);
    expect(mockUserService.create).toHaveBeenCalledWith(createUserDto);
    expect(result).toEqual(user);
    expect(mockLogger.info).toHaveBeenCalled();
  });
  it('should throw ConflictException when signup conflicts', async () => {
    const createUserDto = {
      email: 'test@example.com',
      password: 'password123',
    };
    mockUserService.create.mockRejectedValue(
      new ConflictException('User already exists'),
    );
    await expect(service.signUp(createUserDto)).rejects.toThrow(
      ConflictException,
    );
  });
  it('should throw InternalServerErrorException when signup fails', async () => {
    const createUserDto = {
      email: 'test@example.com',
      password: 'password123',
    };
    mockUserService.create.mockRejectedValue(new Error('Database error'));
    await expect(service.signUp(createUserDto)).rejects.toThrow(
      InternalServerErrorException,
    );
    expect(mockLogger.error).toHaveBeenCalled();
  });

  it('should generate access and refresh tokens', async () => {
    const userId = 'abcd-1234';
    mockJwtService.signAsync
      .mockResolvedValueOnce('access-token')
      .mockResolvedValueOnce('refresh-token');
    const result = await service.generateToken(userId);
    expect(mockJwtService.signAsync).toHaveBeenCalledTimes(2);
    expect(mockJwtService.signAsync).toHaveBeenNthCalledWith(1, {
      sub: userId,
    });
    expect(mockJwtService.signAsync).toHaveBeenNthCalledWith(
      2,
      { sub: userId },
      mockRefreshTokenConfig,
    );
    expect(result).toEqual({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });
  });
  it('should throw InternalServerErrorException when token generation fails', async () => {
    mockJwtService.signAsync.mockRejectedValue(new Error('JWT error'));
    await expect(service.generateToken('abcd-1234')).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  it('should sign in user', async () => {
    const userId = 'abcd-1234';
    jest.spyOn(service, 'generateToken').mockResolvedValue({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });
    mockedArgon2.hash.mockResolvedValue('hashed-refresh-token');

    mockUserService.updateRefreshToken.mockResolvedValue(undefined);
    const result = await service.signin(userId);
    expect(service.generateToken).toHaveBeenCalledWith(userId);
    expect(mockedArgon2.hash).toHaveBeenCalledWith('refresh-token');
    expect(mockUserService.updateRefreshToken).toHaveBeenCalledWith(
      userId,
      'hashed-refresh-token',
    );
    expect(result).toEqual({
      id: userId,
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });
  });
  it('should throw InternalServerErrorException when signin fails', async () => {
    jest
      .spyOn(service, 'generateToken')
      .mockRejectedValue(new Error('JWT error'));
    await expect(service.signin('abcd-1234')).rejects.toThrow(
      InternalServerErrorException,
    );
    expect(mockLogger.error).toHaveBeenCalled();
  });

  it('should refresh access token', async () => {
    const userId = 'abcd-1234';
    jest.spyOn(service, 'generateToken').mockResolvedValue({
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
    });

    mockedArgon2.hash.mockResolvedValue('new-hashed-refresh-token');

    mockUserService.updateRefreshToken.mockResolvedValue(undefined);
    const result = await service.refreshToken(userId);
    expect(service.generateToken).toHaveBeenCalledWith(userId);
    expect(argon2.hash).toHaveBeenCalledWith('new-refresh-token');
    expect(mockUserService.updateRefreshToken).toHaveBeenCalledWith(
      userId,
      'new-hashed-refresh-token',
    );
    expect(result).toEqual({
      id: userId,
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
    });
  });
  it('should throw InternalServerErrorException when refresh fails', async () => {
    jest
      .spyOn(service, 'generateToken')
      .mockRejectedValue(new Error('Token error'));
    await expect(service.refreshToken('abcd-1234')).rejects.toThrow(
      InternalServerErrorException,
    );
    expect(mockLogger.error).toHaveBeenCalled();
  });

  it('should sign out user', async () => {
    const userId = 'abcd-1234';
    mockUserService.updateRefreshToken.mockResolvedValue(undefined);
    const result = await service.signOut(userId);
    expect(mockUserService.updateRefreshToken).toHaveBeenCalledWith(
      userId,
      null,
    );
    expect(result).toEqual({ message: 'Signed out successfully' });
    expect(mockLogger.info).toHaveBeenCalled();
  });
  it('should throw InternalServerErrorException when signout fails', async () => {
    mockUserService.updateRefreshToken.mockRejectedValue(
      new Error('Database error'),
    );
    await expect(service.signOut('abcd-1234')).rejects.toThrow(
      InternalServerErrorException,
    );
    expect(mockLogger.error).toHaveBeenCalled();
  });
});
