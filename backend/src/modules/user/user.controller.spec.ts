import { beforeEach, describe, it, jest, expect } from '@jest/globals';
import { UserController } from './user.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;

  let mockService = {
    userProfile: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    let module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should return a user', async () => {
    let user = {
      name: 'john',
      email: 'johnsmith@gmail.com',
      bio: 'Software engineer',
      status: 'Active',
    };

    let req = { user: { id: 'abcd-1234-0000-0000' } };

    mockService.userProfile.mockResolvedValue(user);
    let result = await controller.findOne(req);
    expect(mockService.userProfile).toHaveBeenCalledWith('abcd-1234-0000-0000');
    expect(result).toEqual(user);
  });

  it('should Update the profile', async () => {
    let updateUser = {
      name: 'john',
      email: 'johnsmith@gmail.com',
      bio: 'Software engineer',
      status: 'Active',
    };

    let req = { user: { id: 'abcd-1234-0000-0000' } };
    let user = {
      name: 'john smith',
      email: 'johnsmith1234@gmail.com',
      bio: 'Software developer',
      status: 'InActive',
    };

    mockService.update.mockResolvedValue(updateUser);
    let result = await controller.update(req, user);
    expect(mockService.update).toHaveBeenCalledWith(
      'abcd-1234-0000-0000',
      user,
    );
    expect(result).toEqual(updateUser);
  });

  it('Should remove the User', async () => {
    let message = { message: 'User deleted' };
    let req = { user: { id: 'abcd-1234-0000-0000' } };
    mockService.remove.mockResolvedValue(message);
    let result = await controller.remove(req);
    expect(mockService.remove).toHaveBeenCalledWith('abcd-1234-0000-0000');
    expect(result).toEqual(message);
  });
});
