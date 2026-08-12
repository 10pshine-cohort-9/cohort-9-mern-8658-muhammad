import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { AuthController } from './auth.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  let mockService = {
    signUp: jest.fn(),
    signin: jest.fn(),
    refreshToken: jest.fn(),
    signOut: jest.fn(),
  };

  beforeEach(async () => {
    let module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should register the user', async () => {
    const user = {
      userId: 'uuid-12300-001201021',
      name: 'Ali',
      email: 'abc@gmail.com',
      bio: 'Software developer',
      status: 'Active',
    };

    const req = {
      name: 'mohsin',
      email: 'mohsinnaveed@gmail.com',
      password: '1234567',
    };

    mockService.signUp.mockResolvedValue(user);
    const result = await controller.signup(req);

    expect(mockService.signUp).toHaveBeenCalledWith(req);
    expect(result).toEqual(user);
  });

  it('should login the user', async () => {
    const user = {
      userId: 'uuid-12300-001201021',
      name: 'Ali',
      email: 'abc@gmail.com',
      bio: 'Software developer',
      status: 'Active',
    };
    // const req = {
    //   email: 'abc@gmail.com',
    //   password: '123456789',
    // };

    const req = {
      user: {
        id: 'abcd-1234-0000-0000',
      },
    };

    mockService.signin.mockResolvedValue(user);
    const result = await controller.signin(req);
    expect(mockService.signin).toHaveBeenCalledWith('abcd-1234-0000-0000');
    expect(result).toEqual(user);
  });

  it('Should Update the refresh token', async () => {
    let UpdateToken = {
      id: 'abcd-1234-0000-0000',
      token: 'ndjcnkdsanoiwndomewoknewnvow',
      refreshToken: 'afafkdmkndknojpowqmfoknqndwqoknoiewncds',
    };

    const req = {
      user: { id: 'abcd-1234-0000-0000' },
    };

    mockService.refreshToken.mockResolvedValue(UpdateToken);
    const result = await controller.refresh(req);

    expect(mockService.refreshToken).toHaveBeenCalledWith(
      'abcd-1234-0000-0000',
    );
    expect(result).toEqual(UpdateToken);
  });

  it('should logout the user', async () => {
    const message = { message: 'Logout user' };
    const req = { user: { id: 'abcd-1234-0000-0000' } };
    mockService.signOut.mockResolvedValue(message);
    const result = await controller.signout(req);
    expect(mockService.signOut).toHaveBeenCalledWith('abcd-1234-0000-0000');
    expect(result).toEqual(message);
  });
});
