import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { ActivityController } from './activity.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { ActivityService } from './activity.service';
import { AuthRequest } from '../auth/interface/auth-req.interface';

describe('ActivityController', () => {
  let controller: ActivityController;
  const mockService = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivityController],
      providers: [
        {
          provide: ActivityService,
          useValue: mockService,
        },
      ],
    }).compile();
    controller = module.get<ActivityController>(ActivityController);
  });

  it('should return all activity ', async () => {
    const act = [
      {
        id: '123',
        action: 'Update',
        message: 'Note is Update',
      },
      {
        id: '124',
        action: 'Delete',
        message: 'Note is Deleted',
      },

      {
        id: '125',
        action: 'Pinned',
        message: 'Note is Pinned',
      },
    ];

    mockService.findAll.mockResolvedValue(act);

    const req = {
      user: {
        id: 'uuid-123-0000',
      },
    } as AuthRequest;

    const result = await controller.findAll(req);

    expect(mockService.findAll).toHaveBeenCalledWith('uuid-123-0000');

    expect(result).toEqual(act);
  });
});
