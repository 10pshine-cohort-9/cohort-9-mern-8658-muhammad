import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { NoteController } from './note.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { NoteService } from './note.service';

describe('NoteController', () => {
  let controller: NoteController;
  let mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    getArchieved: jest.fn(),
    getFavourite: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    pinned: jest.fn(),
    favorite: jest.fn(),
    archived: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NoteController],
      providers: [
        {
          provide: NoteService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<NoteController>(NoteController);
  });

  it('Should create a note', async () => {
    let NoteCreate = {
      title: 'Test Note',
      content: 'This note was created from REST Client',
      pinned: false,
      category: 'Personal',
      archived: false,
      favorite: false,
      tags: ['#new'],
    };
    let Note = {
      title: 'Test Note',
      content: 'This note was created from REST Client',
      pinned: false,
      category: 'Personal',
      archived: false,
      favorite: false,
      tags: ['#new'],
    };

    let req = { user: { id: 'abcd-1234-0000-0000' } };
    mockService.create.mockResolvedValue(Note);
    let result = await controller.create(NoteCreate, req);
    expect(mockService.create).toHaveBeenCalledWith(
      'abcd-1234-0000-0000',
      NoteCreate,
    );
    expect(result).toEqual(Note);
  });

  it('should Update Notes', async () => {
    let NoteUpdate = {
      title: 'Test Note',
      content: 'This note was created from REST Client',
      pinned: false,
      category: 'Personal',
      archived: false,
      favorite: false,
      tags: ['#new'],
    };
    let Note = {
      title: 'Test Note',
      content: 'This note was created from REST Client',
      pinned: false,
      category: 'Personal',
      archived: false,
      favorite: false,
      tags: ['#new'],
    };

    let req = { user: { id: 'abcd-1234-0000-0000' } };
    let noteid = 'abcd-1234-0000-0000';
    mockService.update.mockResolvedValue(Note);
    let result = await controller.update(noteid, NoteUpdate, req);
    expect(mockService.update).toHaveBeenCalledWith(
      'abcd-1234-0000-0000',
      'abcd-1234-0000-0000',
      NoteUpdate,
    );
    expect(result).toEqual(Note);
  });

  it('should find all notes', async () => {
    const req = { user: { id: 'abcd-1234-0000-0000' } };
    const notes = [
      {
        title: 'Test Note 1',
        content: 'First note',
        pinned: false,
        category: 'Personal',
        archived: false,
        favorite: false,
        tags: ['#test'],
      },
      {
        title: 'Test Note 2',
        content: 'Second note',
        pinned: true,
        category: 'Work',
        archived: false,
        favorite: true,
        tags: ['#work'],
      },
    ];
    mockService.findAll.mockResolvedValue(notes);
    const result = await controller.findAll(req);
    expect(mockService.findAll).toHaveBeenCalledWith('abcd-1234-0000-0000');
    expect(result).toEqual(notes);
  });

  it('should get all archived notes', async () => {
    const req = { user: { id: 'abcd-1234-0000-0000' } };
    const notes = [
      {
        title: 'Archived Note',
        content: 'This note is archived',
        pinned: false,
        category: 'Personal',
        archived: true,
        favorite: false,
        tags: ['#archive'],
      },
    ];
    mockService.getArchieved.mockResolvedValue(notes);
    const result = await controller.getarchived(req);
    expect(mockService.getArchieved).toHaveBeenCalledWith(
      'abcd-1234-0000-0000',
    );
    expect(result).toEqual(notes);
  });

  it('should get all favorite notes', async () => {
    const req = { user: { id: 'abcd-1234-0000-0000' } };
    const notes = [
      {
        title: 'Favorite Note',
        content: 'This is my favorite note',
        pinned: false,
        category: 'Personal',
        archived: false,
        favorite: true,
        tags: ['#favorite'],
      },
    ];
    mockService.getFavourite.mockResolvedValue(notes);
    const result = await controller.getfavorite(req);
    expect(mockService.getFavourite).toHaveBeenCalledWith(
      'abcd-1234-0000-0000',
    );
    expect(result).toEqual(notes);
  });

  it('should find one note', async () => {
    const req = { user: { id: 'abcd-1234-0000-0000' } };
    const noteId = 'note-1234';
    const note = {
      title: 'Test Note',
      content: 'This is a test note',
      pinned: false,
      category: 'Personal',
      archived: false,
      favorite: false,
      tags: ['#test'],
    };
    mockService.findOne.mockResolvedValue(note);
    const result = await controller.findOne(noteId, req);
    expect(mockService.findOne).toHaveBeenCalledWith(
      noteId,
      'abcd-1234-0000-0000',
    );
    expect(result).toEqual(note);
  });

  it('should pin note', async () => {
    const req = { user: { id: 'abcd-1234-0000-0000' } };
    const noteId = 'note-1234';
    const note = {
      title: 'Pinned Note',
      content: 'This note is pinned',
      pinned: true,
      category: 'Personal',
      archived: false,
      favorite: false,
      tags: ['#pinned'],
    };
    mockService.pinned.mockResolvedValue(note);
    const result = await controller.pinned(req, noteId);
    expect(mockService.pinned).toHaveBeenCalledWith(
      noteId,
      'abcd-1234-0000-0000',
    );
    expect(result).toEqual(note);
  });

  it('should favorite note', async () => {
    const req = { user: { id: 'abcd-1234-0000-0000' } };
    const noteId = 'note-1234';
    const note = {
      title: 'Favorite Note',
      content: 'This note is favorite',
      pinned: false,
      category: 'Personal',
      archived: false,
      favorite: true,
      tags: ['#favorite'],
    };
    mockService.favorite.mockResolvedValue(note);
    const result = await controller.favorite(req, noteId);
    expect(mockService.favorite).toHaveBeenCalledWith(
      noteId,
      'abcd-1234-0000-0000',
    );
    expect(result).toEqual(note);
  });

  it('should archive note', async () => {
    const req = { user: { id: 'abcd-1234-0000-0000' } };
    const noteId = 'note-1234';
    const note = {
      title: 'Archived Note',
      content: 'This note is archived',
      pinned: false,
      category: 'Personal',
      archived: true,
      favorite: false,
      tags: ['#archived'],
    };
    mockService.archived.mockResolvedValue(note);
    const result = await controller.archived(req, noteId);
    expect(mockService.archived).toHaveBeenCalledWith(
      noteId,
      'abcd-1234-0000-0000',
    );
    expect(result).toEqual(note);
  });

  it('should remove note', async () => {
    const req = { user: { id: 'abcd-1234-0000-0000' } };
    const noteId = 'note-1234';
    const response = { message: 'Note deleted successfully' };
    mockService.remove.mockResolvedValue(response);
    const result = await controller.remove(noteId, req);
    expect(mockService.remove).toHaveBeenCalledWith(
      noteId,
      'abcd-1234-0000-0000',
    );
    expect(result).toEqual(response);
  });
});
