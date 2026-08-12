import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { ActivityService } from './activity.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ActivityType } from './enums/action.enum';
import { Activity } from './entities/activity.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ActivityService', () => {
  let service: ActivityService;
  let mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    let module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivityService,
        {
          provide: getRepositoryToken(Activity),
          useValue: mockRepo,
        },
      ],
    }).compile();
    service = module.get<ActivityService>(ActivityService);
  });

  it('Service should be define', () => {
    expect(service).toBeDefined();
  });

  it('should be create', async () => {
    let act = {
      userId: 'abcd-1234-0000-0000',
      action: ActivityType.NOTE_CREATED,
      message: 'Note is Created',
      noteId: 'abcd-1234-0000-0000',
    };

    let actcreated = {
      action: ActivityType.NOTE_CREATED,
      message: 'Note is Created',
      user: { id: 'abcd-1234-0000-0000' },
      note: { id: 'abcd-1234-0000-0000' },
    };

    let res = {
      actid: 'abcd-1234-0000-0000',
      userId: 'abcd-1234-0000-0000',
      action: ActivityType.NOTE_CREATED,
      message: 'Note is Created',
      noteId: 'abcd-1234-0000-0000',
    };

    mockRepo.create.mockReturnValue(actcreated);
    mockRepo.save.mockResolvedValue(res);

    let result = await service.create(act);
    expect(mockRepo.save).toHaveBeenCalledWith(actcreated);
    expect(result).toEqual(res);
  });

  it('should return all activity', async () => {
    let activity = [
      {
        actid: 'abcd-1234-0000-0000',
        userId: 'abcd-1234-0000-0000',
        action: ActivityType.NOTE_CREATED,
        message: 'Note is Created',
        noteId: 'abcd-1234-0000-0000',
      },

      {
        actid: 'abcd-0000-0000-0000',
        userId: 'abcd-0000-0000-0000',
        action: ActivityType.NOTE_DELETED,
        message: 'Note is Deleted',
        noteId: 'abcd-0000-0000-0000',
      },
    ];

    let userId = 'abcd-0000-0000-0000';
    mockRepo.find.mockResolvedValue(activity);
    let result = await service.findAll(userId);
    expect(mockRepo.find).toHaveBeenCalledWith({
      where: {
        user: { id: userId },
      },
    });
    expect(result).toEqual(activity);
  });
});
