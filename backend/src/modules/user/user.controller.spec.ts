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
    dashboard: jest.fn(),
    userstats: jest.fn(),
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
  describe('dashboard', () => {
    it('should return dashboard data for authenticated user', async () => {
      const dashboardData = {
        stats: {
          totalNotes: 24,
          favoriteNotes: 5,
          archivedNotes: 3,
          todayNotes: 2,
        },

        weeklyNotes: [
          { date: 'Mon', count: 3 },
          { date: 'Tue', count: 5 },
          { date: 'Wed', count: 2 },
          { date: 'Thu', count: 4 },
          { date: 'Fri', count: 1 },
          { date: 'Sat', count: 0 },
          { date: 'Sun', count: 2 },
        ],

        categories: [
          { category: 'Personal', count: 8 },
          { category: 'Work', count: 6 },
          { category: 'Learning', count: 5 },
          { category: 'Ideas', count: 3 },
          { category: 'Journal', count: 2 },
        ],

        recentNotes: [],

        pinnedNotes: [],
      };

      mockService.dashboard.mockResolvedValue(dashboardData);

      const req = {
        user: {
          id: 'user-123',
        },
      };

      const result = await controller.dashboard(req);

      expect(mockService.dashboard).toHaveBeenCalledWith('user-123');

      expect(result).toEqual(dashboardData);
    });

    it('should propagate service errors', async () => {
      mockService.dashboard.mockRejectedValue(new Error('Dashboard failed'));

      const req = {
        user: {
          id: 'user-123',
        },
      };

      await expect(controller.dashboard(req)).rejects.toThrow(
        'Dashboard failed',
      );

      expect(mockService.dashboard).toHaveBeenCalledWith('user-123');
    });
  });

  it('should return user stats', async () => {
    const stats = {
      counts: 24,
      archived: 3,
      favorite: 5,
    };

    mockService.userstats.mockResolvedValue(stats);

    const req = {
      user: {
        id: 'user-123',
      },
    } as any;

    const result = await controller.findUserStats(req);

    expect(mockService.userstats).toHaveBeenCalledWith('user-123');

    expect(result).toEqual(stats);
  });
});
