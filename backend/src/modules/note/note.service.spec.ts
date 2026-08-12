import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { NotFoundException } from '@nestjs/common';

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { NoteService } from './note.service';
import { Note } from './entities/note.entity';
import { ActivityService } from '../activity/activity.service';
import { DataSource } from 'typeorm';
import { PinoLogger } from 'nestjs-pino';
import { ActivityType } from '../activity/enums/action.enum';

describe('NoteService', () => {
  let service: NoteService;

  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findBy: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockActivityService = {
    create: jest.fn(),
  };

  const mockManager = {
    getRepository: jest.fn(),
  };

  const mockDataSource = {
    transaction: jest.fn(),
  };

  const mockLogger = {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    mockManager.getRepository.mockReturnValue(mockRepo);

    mockDataSource.transaction.mockImplementation(async (callback: any) => {
      return callback(mockManager);
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NoteService,

        {
          provide: getRepositoryToken(Note),
          useValue: mockRepo,
        },

        {
          provide: ActivityService,
          useValue: mockActivityService,
        },

        {
          provide: DataSource,
          useValue: mockDataSource,
        },

        {
          provide: PinoLogger,
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<NoteService>(NoteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a note', async () => {
    const userId = 'user-123';

    const createNoteDto = {
      title: 'Test Note',
      content: 'Test Content',
      pinned: false,
      category: 'Personal',
      archived: false,
      favorite: false,
      tags: ['#new'],
    };

    const noteCreated = {
      id: 'note-123',
      ...createNoteDto,
      user: {
        id: userId,
      },
    };

    mockRepo.create.mockReturnValue(noteCreated);
    mockRepo.save.mockResolvedValue(noteCreated);

    mockActivityService.create.mockResolvedValue(undefined);

    const result = await service.create(userId, createNoteDto);

    expect(mockDataSource.transaction).toHaveBeenCalled();

    expect(mockRepo.create).toHaveBeenCalledWith({
      ...createNoteDto,
      user: {
        id: userId,
      },
    });

    expect(mockRepo.save).toHaveBeenCalledWith(noteCreated);

    expect(mockActivityService.create).toHaveBeenCalledWith(
      {
        userId,
        noteId: noteCreated.id,
        action: ActivityType.NOTE_CREATED,
        message: `Created "${noteCreated.title}"`,
      },
      mockManager,
    );

    expect(result).toEqual(noteCreated);
  });

  it('should return all notes', async () => {
    const userId = 'user-123';

    const notes = [
      {
        id: 'note-1',
        title: 'Note 1',
      },
      {
        id: 'note-2',
        title: 'Note 2',
      },
    ];

    mockRepo.find.mockResolvedValue(notes);

    const result = await service.findAll(userId);

    expect(mockRepo.find).toHaveBeenCalledWith({
      where: {
        user: {
          id: userId,
        },
      },
      order: {
        pinned: 'DESC',
        createdAt: 'DESC',
      },
    });

    expect(result).toEqual(notes);
  });

  it('should return one note', async () => {
    const userId = 'user-123';
    const noteId = 'note-123';

    const note = {
      id: noteId,
      title: 'Test Note',
      user: {
        id: userId,
      },
    };

    mockRepo.findOne.mockResolvedValue(note);

    const result = await service.findOne(noteId, userId);

    expect(mockRepo.findOne).toHaveBeenCalledWith({
      where: {
        user: {
          id: userId,
        },
        id: noteId,
      },
    });

    expect(result).toEqual(note);
  });

  it('should throw NotFoundException when note is not found', async () => {
    const userId = 'user-123';
    const noteId = 'note-123';

    mockRepo.findOne.mockResolvedValue(null);

    await expect(service.findOne(noteId, userId)).rejects.toThrow(
      new NotFoundException('Note not found'),
    );

    expect(mockLogger.warn).toHaveBeenCalled();
  });

  it('should update a note', async () => {
    const userId = 'user-123';
    const noteId = 'note-123';

    const updateNoteDto = {
      title: 'Updated Note',
      content: 'Updated Content',
    };

    const updatedNote = {
      id: noteId,
      title: 'Updated Note',
      content: 'Updated Content',
      user: {
        id: userId,
      },
    };

    mockRepo.update.mockResolvedValue({
      affected: 1,
    });

    mockRepo.findOne.mockResolvedValue(updatedNote);

    mockActivityService.create.mockResolvedValue(undefined);

    const result = await service.update(userId, noteId, updateNoteDto);

    expect(mockRepo.update).toHaveBeenCalledWith(
      {
        id: noteId,
        user: {
          id: userId,
        },
      },
      updateNoteDto,
    );

    expect(mockRepo.findOne).toHaveBeenCalledWith({
      where: {
        user: {
          id: userId,
        },
        id: noteId,
      },
    });

    expect(mockActivityService.create).toHaveBeenCalledWith(
      {
        userId,
        noteId: updatedNote.id,
        action: ActivityType.NOTE_UPDATED,
        message: `Updated "${updatedNote.title}"`,
      },
      mockManager,
    );

    expect(result).toEqual(updatedNote);
  });

  it('should throw NotFoundException when updating missing note', async () => {
    const userId = 'user-123';
    const noteId = 'note-123';

    mockRepo.update.mockResolvedValue({
      affected: 0,
    });

    await expect(
      service.update(userId, noteId, {
        title: 'Updated',
      }),
    ).rejects.toThrow(new NotFoundException('Note not found'));

    expect(mockRepo.update).toHaveBeenCalled();
  });

  it('should remove a note', async () => {
    const userId = 'user-123';
    const noteId = 'note-123';

    const note = {
      id: noteId,
      title: 'Test Note',
      user: {
        id: userId,
      },
    };

    mockRepo.findOne.mockResolvedValue(note);

    mockRepo.delete.mockResolvedValue({
      affected: 1,
    });

    mockActivityService.create.mockResolvedValue(undefined);

    const result = await service.remove(noteId, userId);

    expect(mockRepo.findOne).toHaveBeenCalled();

    expect(mockRepo.delete).toHaveBeenCalledWith({
      id: noteId,
      user: {
        id: userId,
      },
    });

    expect(mockActivityService.create).toHaveBeenCalledWith(
      {
        userId,
        action: ActivityType.NOTE_DELETED,
        message: `Deleted "${note.title}"`,
      },
      mockManager,
    );

    expect(result).toEqual({
      message: 'Deleted Successfully',
    });
  });

  it('should throw NotFoundException when deleting missing note', async () => {
    const userId = 'user-123';
    const noteId = 'note-123';

    mockRepo.findOne.mockResolvedValue(null);

    await expect(service.remove(noteId, userId)).rejects.toThrow(
      new NotFoundException('Note not found'),
    );
  });

  it('should pin a note', async () => {
    const userId = 'user-123';
    const noteId = 'note-123';

    const note = {
      id: noteId,
      title: 'Test Note',
      pinned: false,
      user: {
        id: userId,
      },
    };

    const queryBuilder = {
      leftJoin: jest.fn(),
      setLock: jest.fn(),
      where: jest.fn(),
      andWhere: jest.fn(),
      getOne: jest.fn(),
    };

    queryBuilder.leftJoin.mockReturnValue(queryBuilder);
    queryBuilder.setLock.mockReturnValue(queryBuilder);
    queryBuilder.where.mockReturnValue(queryBuilder);
    queryBuilder.andWhere.mockReturnValue(queryBuilder);
    queryBuilder.getOne.mockResolvedValue(note);

    mockRepo.createQueryBuilder.mockReturnValue(queryBuilder);

    mockRepo.update.mockResolvedValue({
      affected: 1,
    });

    mockActivityService.create.mockResolvedValue(undefined);

    const result = await service.pinned(noteId, userId);

    expect(mockRepo.createQueryBuilder).toHaveBeenCalledWith('note');

    expect(queryBuilder.leftJoin).toHaveBeenCalledWith('note.user', 'user');

    expect(queryBuilder.setLock).toHaveBeenCalledWith('pessimistic_write');

    expect(queryBuilder.where).toHaveBeenCalledWith('note.id=:id', {
      id: noteId,
    });

    expect(queryBuilder.andWhere).toHaveBeenCalledWith('user.id = :userId', {
      userId,
    });

    expect(mockRepo.update).toHaveBeenCalledWith(
      {
        id: noteId,
        user: {
          id: userId,
        },
      },
      {
        pinned: true,
      },
    );

    expect(mockActivityService.create).toHaveBeenCalledWith(
      {
        userId,
        noteId,
        action: ActivityType.NOTE_PINNED,
        message: `Pinned "${note.title}"`,
      },
      mockManager,
    );

    expect(result).toEqual({
      message: 'Pinned',
      note: {
        ...note,
        pinned: true,
      },
    });
  });

  it('should throw NotFoundException when pinning missing note', async () => {
    const queryBuilder = {
      leftJoin: jest.fn(),
      setLock: jest.fn(),
      where: jest.fn(),
      andWhere: jest.fn(),
      getOne: jest.fn(),
    };

    queryBuilder.leftJoin.mockReturnValue(queryBuilder);
    queryBuilder.setLock.mockReturnValue(queryBuilder);
    queryBuilder.where.mockReturnValue(queryBuilder);
    queryBuilder.andWhere.mockReturnValue(queryBuilder);
    queryBuilder.getOne.mockResolvedValue(null);

    mockRepo.createQueryBuilder.mockReturnValue(queryBuilder);

    await expect(service.pinned('note-123', 'user-123')).rejects.toThrow(
      new NotFoundException('Note not found'),
    );
  });

  it('should favorite a note', async () => {
    const userId = 'user-123';
    const noteId = 'note-123';

    const note = {
      id: noteId,
      title: 'Test Note',
      favorite: false,
      user: {
        id: userId,
      },
    };

    const queryBuilder = {
      leftJoin: jest.fn(),
      setLock: jest.fn(),
      where: jest.fn(),
      andWhere: jest.fn(),
      getOne: jest.fn(),
    };

    queryBuilder.leftJoin.mockReturnValue(queryBuilder);
    queryBuilder.setLock.mockReturnValue(queryBuilder);
    queryBuilder.where.mockReturnValue(queryBuilder);
    queryBuilder.andWhere.mockReturnValue(queryBuilder);
    queryBuilder.getOne.mockResolvedValue(note);

    mockRepo.createQueryBuilder.mockReturnValue(queryBuilder);

    mockRepo.update.mockResolvedValue({
      affected: 1,
    });

    mockActivityService.create.mockResolvedValue(undefined);

    const result = await service.favorite(noteId, userId);

    expect(mockRepo.update).toHaveBeenCalledWith(
      {
        id: noteId,
        user: {
          id: userId,
        },
      },
      {
        favorite: true,
      },
    );

    expect(mockActivityService.create).toHaveBeenCalledWith(
      {
        userId,
        noteId,
        action: ActivityType.NOTE_FAVORITED,
        message: `Added to favorites "${note.title}"`,
      },
      mockManager,
    );

    expect(result).toEqual({
      message: 'Favorite',
      note: {
        ...note,
        favorite: true,
      },
    });
  });

  it('should unfavorite a note', async () => {
    const userId = 'user-123';
    const noteId = 'note-123';

    const note = {
      id: noteId,
      title: 'Test Note',
      favorite: true,
      user: {
        id: userId,
      },
    };

    const queryBuilder = {
      leftJoin: jest.fn(),
      setLock: jest.fn(),
      where: jest.fn(),
      andWhere: jest.fn(),
      getOne: jest.fn(),
    };

    queryBuilder.leftJoin.mockReturnValue(queryBuilder);
    queryBuilder.setLock.mockReturnValue(queryBuilder);
    queryBuilder.where.mockReturnValue(queryBuilder);
    queryBuilder.andWhere.mockReturnValue(queryBuilder);
    queryBuilder.getOne.mockResolvedValue(note);

    mockRepo.createQueryBuilder.mockReturnValue(queryBuilder);

    mockRepo.update.mockResolvedValue({
      affected: 1,
    });

    const result = await service.favorite(noteId, userId);

    expect(mockRepo.update).toHaveBeenCalledWith(
      {
        id: noteId,
        user: {
          id: userId,
        },
      },
      {
        favorite: false,
      },
    );

    expect(result.message).toBe('UnFavorite');
    expect(result.note.favorite).toBe(false);
  });

  it('should archive a note', async () => {
    const userId = 'user-123';
    const noteId = 'note-123';

    const note = {
      id: noteId,
      title: 'Test Note',
      archived: false,
      user: {
        id: userId,
      },
    };

    const queryBuilder = {
      leftJoin: jest.fn(),
      setLock: jest.fn(),
      where: jest.fn(),
      andWhere: jest.fn(),
      getOne: jest.fn(),
    };

    queryBuilder.leftJoin.mockReturnValue(queryBuilder);
    queryBuilder.setLock.mockReturnValue(queryBuilder);
    queryBuilder.where.mockReturnValue(queryBuilder);
    queryBuilder.andWhere.mockReturnValue(queryBuilder);
    queryBuilder.getOne.mockResolvedValue(note);

    mockRepo.createQueryBuilder.mockReturnValue(queryBuilder);

    mockRepo.update.mockResolvedValue({
      affected: 1,
    });

    mockActivityService.create.mockResolvedValue(undefined);

    const result = await service.archived(noteId, userId);

    expect(mockRepo.update).toHaveBeenCalledWith(
      {
        id: noteId,
        user: {
          id: userId,
        },
      },
      {
        archived: true,
      },
    );

    expect(mockActivityService.create).toHaveBeenCalledWith(
      {
        userId,
        noteId,
        action: ActivityType.NOTE_ARCHIVED,
        message: `Added to Archived "${note.title}"`,
      },
      mockManager,
    );

    expect(result).toEqual({
      message: 'Archived',
      note: {
        ...note,
        archived: true,
      },
    });
  });

  it('should throw NotFoundException when archiving missing note', async () => {
    const queryBuilder = {
      leftJoin: jest.fn(),
      setLock: jest.fn(),
      where: jest.fn(),
      andWhere: jest.fn(),
      getOne: jest.fn(),
    };

    queryBuilder.leftJoin.mockReturnValue(queryBuilder);
    queryBuilder.setLock.mockReturnValue(queryBuilder);
    queryBuilder.where.mockReturnValue(queryBuilder);
    queryBuilder.andWhere.mockReturnValue(queryBuilder);
    queryBuilder.getOne.mockResolvedValue(null);

    mockRepo.createQueryBuilder.mockReturnValue(queryBuilder);

    await expect(service.archived('note-123', 'user-123')).rejects.toThrow(
      new NotFoundException('Note not found'),
    );
  });

  it('should return archived notes', async () => {
    const userId = 'user-123';

    const notes = [
      {
        id: 'note-1',
        archived: true,
      },
    ];

    mockRepo.findBy.mockResolvedValue(notes);

    const result = await service.getArchieved(userId);

    expect(mockRepo.findBy).toHaveBeenCalledWith({
      archived: true,
      user: {
        id: userId,
      },
    });

    expect(result).toEqual(notes);
  });

  it('should return favorite notes', async () => {
    const userId = 'user-123';

    const notes = [
      {
        id: 'note-1',
        favorite: true,
      },
    ];

    mockRepo.findBy.mockResolvedValue(notes);

    const result = await service.getFavourite(userId);

    expect(mockRepo.findBy).toHaveBeenCalledWith({
      favorite: true,
      user: {
        id: userId,
      },
    });

    expect(result).toEqual(notes);
  });
});
