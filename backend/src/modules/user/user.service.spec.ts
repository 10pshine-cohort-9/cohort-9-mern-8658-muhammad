import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { Note } from '../note/entities/note.entity';

import { PinoLogger } from 'nestjs-pino';
import { Repository } from 'typeorm';

describe('UserService', () => {
  let service: UserService;

  type MockUserRepository = Pick<
    Repository<User>,
    'findOne' | 'find' | 'create' | 'save' | 'update' | 'delete'
  >;

  const mockRepo: jest.Mocked<MockUserRepository> = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  type MockNoteRepository = Pick<
    Repository<Note>,
    'count' | 'find' | 'createQueryBuilder'
  >;

  const mockNoteRepo: jest.Mocked<MockNoteRepository> = {
    count: jest.fn(),
    find: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  type MockLogger = Pick<PinoLogger, 'info' | 'warn' | 'error'>;

  const mockLogger: jest.Mocked<MockLogger> = {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };

  const createQueryBuilderMock = () => {
    const queryBuilder = {
      select: jest.fn(),
      addSelect: jest.fn(),
      leftJoin: jest.fn(),
      where: jest.fn(),
      andWhere: jest.fn(),
      groupBy: jest.fn(),
      orderBy: jest.fn(),
      getCount: jest.fn(),
      getMany: jest.fn(),
      getRawMany: jest.fn(),
    };

    queryBuilder.select.mockReturnValue(queryBuilder);
    queryBuilder.addSelect.mockReturnValue(queryBuilder);
    queryBuilder.leftJoin.mockReturnValue(queryBuilder);
    queryBuilder.where.mockReturnValue(queryBuilder);
    queryBuilder.andWhere.mockReturnValue(queryBuilder);
    queryBuilder.groupBy.mockReturnValue(queryBuilder);
    queryBuilder.orderBy.mockReturnValue(queryBuilder);

    return queryBuilder;
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,

        {
          provide: getRepositoryToken(User),
          useValue: mockRepo,
        },

        {
          provide: getRepositoryToken(Note),
          useValue: mockNoteRepo,
        },

        {
          provide: PinoLogger,
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto = {
        name: 'John Doe',
        email: '  JOHN@EXAMPLE.COM ',
        password: 'password123',
      };

      const user = {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        passwordHash: 'password123',
        hashRefreshToken: null,
      };

      const expectedResult = {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
      };

      mockRepo.findOne.mockResolvedValue(null);
      mockRepo.create.mockReturnValue(user as User);
      mockRepo.save.mockResolvedValue(user as User);

      const result = await service.create(createUserDto);

      expect(mockRepo.findOne).toHaveBeenCalledWith({
        where: {
          email: 'john@example.com',
        },
      });

      expect(mockRepo.create).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        passwordHash: 'password123',
      });

      expect(mockRepo.save).toHaveBeenCalledWith(user);

      expect(result).toEqual(expectedResult);
    });

    it('should throw ConflictException when email already exists', async () => {
      const createUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      mockRepo.findOne.mockResolvedValue({
        id: 'existing-user',
        email: 'john@example.com',
      } as User);

      await expect(service.create(createUserDto)).rejects.toThrow(
        new ConflictException('Email already exists'),
      );

      expect(mockRepo.findOne).toHaveBeenCalledWith({
        where: {
          email: 'john@example.com',
        },
      });

      expect(mockLogger.warn).toHaveBeenCalled();
    });

    it('should throw ConflictException when database returns 23505', async () => {
      const createUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      mockRepo.findOne.mockResolvedValue(null);

      const dbError = {
        code: '23505',
      };

      mockRepo.create.mockReturnValue({
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        passwordHash: 'password123',
      } as User);

      mockRepo.save.mockRejectedValue(dbError);

      await expect(service.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );

      expect(mockLogger.warn).toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException when create fails', async () => {
      const createUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      mockRepo.findOne.mockRejectedValue(new Error('Database error'));

      await expect(service.create(createUserDto)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(mockLogger.error).toHaveBeenCalled();
    });
  });

  describe('findOneByEmail', () => {
    it('should find user by email', async () => {
      const user = {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        passwordHash: 'password123',
      };

      mockRepo.findOne.mockResolvedValue(user as User);

      const result = await service.findOneByEmail('  JOHN@EXAMPLE.COM ');

      expect(mockRepo.findOne).toHaveBeenCalledWith({
        where: {
          email: 'john@example.com',
        },
      });

      expect(result).toEqual(user);
    });

    it('should throw UnauthorizedException when email user is not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      await expect(service.findOneByEmail('john@example.com')).rejects.toThrow(
        new UnauthorizedException('User not found !'),
      );
    });

    it('should throw InternalServerErrorException when findOneByEmail fails', async () => {
      mockRepo.findOne.mockRejectedValueOnce(new Error('Database error'));

      await expect(service.findOneByEmail('john@example.com')).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(mockLogger.error).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all users without sensitive fields', async () => {
      const users = [
        {
          id: 'user-1',
          name: 'John',
          email: 'john@example.com',
          passwordHash: 'secret1',
          hashRefreshToken: 'refresh1',
        },
        {
          id: 'user-2',
          name: 'Jane',
          email: 'jane@example.com',
          passwordHash: 'secret2',
          hashRefreshToken: 'refresh2',
        },
      ];

      mockRepo.find.mockResolvedValue(users as User[]);

      const result = await service.findAll();

      expect(mockRepo.find).toHaveBeenCalled();

      expect(result).toEqual([
        {
          id: 'user-1',
          name: 'John',
          email: 'john@example.com',
        },
        {
          id: 'user-2',
          name: 'Jane',
          email: 'jane@example.com',
        },
      ]);
    });

    it('should return empty array when no users exist', async () => {
      mockRepo.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });

    it('should throw InternalServerErrorException when findAll fails', async () => {
      mockRepo.find.mockRejectedValueOnce(new Error('Database error'));

      await expect(service.findAll()).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(mockLogger.error).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should find one user', async () => {
      const user = {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        passwordHash: 'password123',
      };

      mockRepo.findOne.mockResolvedValue(user as User);

      const result = await service.findOne('user-123');

      expect(mockRepo.findOne).toHaveBeenCalledWith({
        where: {
          id: 'user-123',
        },
      });

      expect(result).toEqual(user);
    });

    it('should throw NotFoundException when user is not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne('user-123')).rejects.toThrow(
        new NotFoundException('User not found'),
      );
    });

    it('should throw InternalServerErrorException when findOne fails', async () => {
      mockRepo.findOne.mockRejectedValueOnce(new Error('Database error'));

      await expect(service.findOne('user-123')).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(mockLogger.error).toHaveBeenCalled();
    });
  });

  describe('userProfile', () => {
    it('should return user profile without sensitive fields', async () => {
      const user = {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        passwordHash: 'password123',
        hashRefreshToken: 'refresh-token',
      };

      mockRepo.findOne.mockResolvedValue(user as User);

      const result = await service.userProfile('user-123');

      expect(mockRepo.findOne).toHaveBeenCalledWith({
        where: {
          id: 'user-123',
        },
      });

      expect(result).toEqual({
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
      });
    });

    it('should throw NotFoundException when profile user is not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      await expect(service.userProfile('user-123')).rejects.toThrow(
        new NotFoundException('User not found'),
      );
    });

    it('should throw InternalServerErrorException when profile fetch fails', async () => {
      mockRepo.findOne.mockRejectedValueOnce(new Error('Database error'));

      await expect(service.userProfile('user-123')).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(mockLogger.error).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update user profile', async () => {
      const updateUserDto = {
        name: 'Updated John',
      };

      const existingUser = {
        id: 'user-123',
        name: 'John',
        email: 'john@example.com',
        passwordHash: 'password123',
        hashRefreshToken: null,
      };

      const updatedUser = {
        id: 'user-123',
        name: 'Updated John',
        email: 'john@example.com',
        passwordHash: 'password123',
        hashRefreshToken: null,
      };

      mockRepo.findOne
        .mockResolvedValueOnce(existingUser as User)
        .mockResolvedValueOnce(updatedUser as User);

      mockRepo.update.mockResolvedValue({
        affected: 1,
      } as any);

      const result = await service.update('user-123', updateUserDto);

      expect(mockRepo.update).toHaveBeenCalledWith('user-123', updateUserDto);

      expect(result).toEqual({
        id: 'user-123',
        name: 'Updated John',
        email: 'john@example.com',
      });
    });

    it('should throw NotFoundException when updating non-existing user', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      await expect(
        service.update('user-123', {
          name: 'Updated John',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when no record is updated', async () => {
      const user = {
        id: 'user-123',
        name: 'John',
        email: 'john@example.com',
        passwordHash: 'password123',
        hashRefreshToken: null,
      };

      mockRepo.findOne.mockResolvedValue(user as User);

      mockRepo.update.mockResolvedValue({
        affected: 0,
      } as any);

      await expect(
        service.update('user-123', {
          name: 'Updated John',
        }),
      ).rejects.toThrow(new BadRequestException('No record was updated'));
    });

    it('should throw InternalServerErrorException when update fails', async () => {
      const user = {
        id: 'user-123',
        name: 'John',
        email: 'john@example.com',
        passwordHash: 'password123',
        hashRefreshToken: null,
      };

      mockRepo.findOne.mockResolvedValue(user as User);

      mockRepo.update.mockRejectedValueOnce(new Error('Database error'));

      await expect(
        service.update('user-123', {
          name: 'Updated John',
        }),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const user = {
        id: 'user-123',
        name: 'John',
        email: 'john@example.com',
      };

      mockRepo.findOne.mockResolvedValue(user as User);

      mockRepo.delete.mockResolvedValue({
        affected: 1,
      } as any);

      const result = await service.remove('user-123');

      expect(mockRepo.findOne).toHaveBeenCalledWith({
        where: {
          id: 'user-123',
        },
      });

      expect(mockRepo.delete).toHaveBeenCalledWith('user-123');

      expect(result).toEqual({
        message: 'User deleted successfully',
      });
    });

    it('should throw NotFoundException when removing non-existing user', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      await expect(service.remove('user-123')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException when remove fails', async () => {
      const user = {
        id: 'user-123',
        name: 'John',
        email: 'john@example.com',
      };

      mockRepo.findOne.mockResolvedValue(user as User);

      mockRepo.delete.mockRejectedValueOnce(new Error('Database error'));

      await expect(service.remove('user-123')).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(mockLogger.error).toHaveBeenCalled();
    });
  });

  describe('updateRefreshToken', () => {
    it('should update refresh token', async () => {
      const updateResult = {
        affected: 1,
        generatedMaps: [],
        raw: {},
      };

      mockRepo.update.mockResolvedValue(updateResult as any);

      const result = await service.updateRefreshToken(
        'user-123',
        'hashed-refresh-token',
      );

      expect(mockRepo.update).toHaveBeenCalledWith(
        {
          id: 'user-123',
        },
        {
          hashRefreshToken: 'hashed-refresh-token',
        },
      );

      expect(result).toEqual(updateResult);
    });

    it('should clear refresh token', async () => {
      const updateResult = {
        affected: 1,
        generatedMaps: [],
        raw: {},
      };

      mockRepo.update.mockResolvedValue(updateResult as any);

      const result = await service.updateRefreshToken('user-123', null);

      expect(mockRepo.update).toHaveBeenCalledWith(
        {
          id: 'user-123',
        },
        {
          hashRefreshToken: null,
        },
      );

      expect(result).toEqual(updateResult);
    });

    it('should throw NotFoundException when updating refresh token for non-existing user', async () => {
      mockRepo.update.mockResolvedValue({
        affected: 0,
        generatedMaps: [],
        raw: {},
      } as any);

      await expect(
        service.updateRefreshToken('user-123', 'hashed-refresh-token'),
      ).rejects.toThrow(new NotFoundException('User not found'));
    });

    it('should throw InternalServerErrorException when refresh token update fails', async () => {
      mockRepo.update.mockRejectedValueOnce(new Error('Database error'));

      await expect(
        service.updateRefreshToken('user-123', 'hashed-refresh-token'),
      ).rejects.toThrow(InternalServerErrorException);

      expect(mockLogger.error).toHaveBeenCalled();
    });
  });

  describe('userstats', () => {
    it('should return user note statistics', async () => {
      mockNoteRepo.count
        .mockResolvedValueOnce(24)
        .mockResolvedValueOnce(3)
        .mockResolvedValueOnce(5);

      const result = await service.userstats('user-123');

      expect(mockNoteRepo.count).toHaveBeenCalledTimes(3);

      expect(mockNoteRepo.count).toHaveBeenNthCalledWith(1, {
        where: {
          user: {
            id: 'user-123',
          },
        },
      });

      expect(mockNoteRepo.count).toHaveBeenNthCalledWith(2, {
        where: {
          user: {
            id: 'user-123',
          },
          archived: true,
        },
      });

      expect(mockNoteRepo.count).toHaveBeenNthCalledWith(3, {
        where: {
          user: {
            id: 'user-123',
          },
          favorite: true,
        },
      });

      expect(result).toEqual({
        counts: 24,
        archived: 3,
        favorite: 5,
      });
    });

    it('should throw InternalServerErrorException when stats fail', async () => {
      mockNoteRepo.count.mockRejectedValueOnce(new Error('Database error'));

      await expect(service.userstats('user-123')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('dashboard', () => {
    it('should return complete dashboard data', async () => {
      const user = {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        passwordHash: 'password123',
        hashRefreshToken: null,
      };

      mockRepo.findOne.mockResolvedValue(user as User);

      const todayQueryBuilder = createQueryBuilderMock();

      const weeklyQueryBuilder = createQueryBuilderMock();

      const categoryQueryBuilder = createQueryBuilderMock();

      mockNoteRepo.createQueryBuilder
        .mockReturnValueOnce(todayQueryBuilder as any)
        .mockReturnValueOnce(weeklyQueryBuilder as any)
        .mockReturnValueOnce(categoryQueryBuilder as any);

      todayQueryBuilder.getCount.mockResolvedValue(2);

      weeklyQueryBuilder.getMany.mockResolvedValue([
        {
          id: 'note-1',
          title: 'Monday Note',
          createdAt: new Date('2026-08-17T10:00:00'),
        },
        {
          id: 'note-2',
          title: 'Tuesday Note',
          createdAt: new Date('2026-08-18T10:00:00'),
        },
        {
          id: 'note-3',
          title: 'Tuesday Note 2',
          createdAt: new Date('2026-08-18T12:00:00'),
        },
      ]);

      /*
       * Categories
       */
      categoryQueryBuilder.getRawMany.mockResolvedValue([
        {
          category: 'Personal',
          count: '8',
        },
        {
          category: 'Work',
          count: '6',
        },
        {
          category: 'Learning',
          count: '5',
        },
        {
          category: 'Ideas',
          count: '3',
        },
        {
          category: 'Journal',
          count: '2',
        },
      ]);

      mockNoteRepo.count
        .mockResolvedValueOnce(24)
        .mockResolvedValueOnce(5)
        .mockResolvedValueOnce(3);

      const recentNotes = [
        {
          id: 'note-1',
          title: 'Recent Note',
          content: 'Some content',
        },
      ];

      const pinnedNotes = [
        {
          id: 'note-2',
          title: 'Pinned Note',
          content: 'Pinned content',
          pinned: true,
        },
      ];

      mockNoteRepo.find
        .mockResolvedValueOnce(recentNotes as any)
        .mockResolvedValueOnce(pinnedNotes as any);

      const result = await service.dashboard('user-123');

      expect(result.stats).toEqual({
        totalNotes: 24,
        favoriteNotes: 5,
        archivedNotes: 3,
        todayNotes: 2,
      });

      expect(result.weeklyNotes).toHaveLength(7);

      expect(result.weeklyNotes).toEqual(
        expect.arrayContaining([
          {
            date: 'Mon',
            count: 1,
          },
          {
            date: 'Tue',
            count: 2,
          },
          {
            date: 'Wed',
            count: 0,
          },
          {
            date: 'Thu',
            count: 0,
          },
          {
            date: 'Fri',
            count: 0,
          },
          {
            date: 'Sat',
            count: 0,
          },
          {
            date: 'Sun',
            count: 0,
          },
        ]),
      );

      expect(result.categories).toEqual([
        {
          category: 'Personal',
          count: 8,
        },
        {
          category: 'Work',
          count: 6,
        },
        {
          category: 'Learning',
          count: 5,
        },
        {
          category: 'Ideas',
          count: 3,
        },
        {
          category: 'Journal',
          count: 2,
        },
      ]);

      expect(result.recentNotes).toEqual(recentNotes);

      expect(result.pinnedNotes).toEqual(pinnedNotes);
    });

    it('should call findOne with the authenticated user id', async () => {
      const user = {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
      };

      mockRepo.findOne.mockResolvedValue(user as User);

      const queryBuilder = createQueryBuilderMock();
      mockNoteRepo.createQueryBuilder.mockReturnValue(queryBuilder as any);

      mockNoteRepo.count.mockRejectedValueOnce(new Error('Database error'));

      await expect(service.dashboard('user-123')).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(mockRepo.findOne).toHaveBeenCalledWith({
        where: {
          id: 'user-123',
        },
      });
    });

    it('should throw NotFoundException when user does not exist', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      await expect(service.dashboard('user-123')).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(mockNoteRepo.count).not.toHaveBeenCalled();

      expect(mockNoteRepo.find).not.toHaveBeenCalled();

      expect(mockNoteRepo.createQueryBuilder).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException when dashboard fails', async () => {
      const user = {
        id: 'user-123',
        name: 'John',
        email: 'john@example.com',
      };

      mockRepo.findOne.mockResolvedValue(user as User);

      const queryBuilder = createQueryBuilderMock();
      mockNoteRepo.createQueryBuilder.mockReturnValue(queryBuilder as any);

      mockNoteRepo.count.mockRejectedValueOnce(new Error('Database error'));

      await expect(service.dashboard('user-123')).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(mockLogger.error).toHaveBeenCalled();
    });
  });
});
