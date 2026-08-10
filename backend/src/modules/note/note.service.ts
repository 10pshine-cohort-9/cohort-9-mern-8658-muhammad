import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { ActivityService } from '../activity/activity.service';
import { ActivityType } from '../activity/enums/action.enum';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note) private noteRepo: Repository<Note>,
    private activityService: ActivityService,
  ) {}

  async create(userId: string, createNoteDto: CreateNoteDto) {
    const note = this.noteRepo.create({
      ...createNoteDto,
      user: { id: userId },
    });
    const savedNote = await this.noteRepo.save(note);

    await this.activityService.create({
      userId,
      noteId: savedNote.id,
      action: ActivityType.NOTE_CREATED,
      message: `Created "${savedNote.title}"`,
    });

    return savedNote;
  }

  async findAll(userId: string) {
    const notes = await this.noteRepo.find({
      where: {
        user: {
          id: userId,
        },
      },
      order: { pinned: 'DESC', createdAt: 'DESC' },
    });
    return notes;
  }

  async findOne(id: string, userId: string) {
    const note = await this.noteRepo.findOne({
      where: {
        user: {
          id: userId,
        },
        id: id,
      },
    });
    if (!note) {
      throw new NotFoundException('Note not found');
    }

    return note;
  }

  async update(userId: string, id: string, updateNoteDto: UpdateNoteDto) {
    const updatenote = await this.noteRepo.update(
      { id, user: { id: userId } },
      updateNoteDto,
    );
    if (updatenote.affected === 0) {
      throw new NotFoundException('Note not found');
    }
    const note = await this.findOne(id, userId);

    await this.activityService.create({
      userId,
      noteId: note.id,
      action: ActivityType.NOTE_UPDATED,
      message: `Updated "${note.title}"`,
    });
    return note;
  }

  async remove(id: string, userId: string) {
    const note = await this.findOne(id, userId);

    const deletenote = await this.noteRepo.delete({
      id: id,
      user: { id: userId },
    });
    if (deletenote.affected === 0) {
      throw new NotFoundException('Note not found');
    }
    await this.activityService.create({
      userId,
      action: ActivityType.NOTE_DELETED,
      message: `Deleted "${note.title}"`,
    });

    return { message: 'Deleted Successfully' };
  }

  async pinned(id: string, userId: string, pinned: boolean) {
    const note = await this.findOne(id, userId);
    const updatePinned = await this.noteRepo.update(
      { id: id, user: { id: userId } },
      { pinned },
    );
    if (updatePinned.affected === 0) {
      throw new NotFoundException('Note not found');
    }

    await this.activityService.create({
      userId,
      noteId: note.id,
      action: pinned ? ActivityType.NOTE_PINNED : ActivityType.NOTE_UNPINNED,
      message: `${pinned ? 'Pinned' : 'UnPinned'} "${note.title}"`,
    });
    return { message: pinned ? 'Pinned' : 'UnPinned' };
  }

  async favorite(id: string, userId: string, favorite: boolean) {
    const note = await this.findOne(id, userId);
    const updatePinned = await this.noteRepo.update(
      { id: id, user: { id: userId } },
      { favorite },
    );
    if (updatePinned.affected === 0) {
      throw new NotFoundException('Note not found');
    }
    await this.activityService.create({
      userId,
      noteId: note.id,
      action: favorite
        ? ActivityType.NOTE_FAVORITED
        : ActivityType.NOTE_UNFAVORITED,
      message: `${favorite ? 'Added to favorites' : 'Removed from favorites'} "${note.title}"`,
    });

    return { message: favorite ? 'Favorite' : 'UnFavorite' };
  }

  async archived(id: string, userId: string, archived: boolean) {
    const note = await this.findOne(id, userId);
    const updatePinned = await this.noteRepo.update(
      { id: id, user: { id: userId } },
      { archived },
    );
    if (updatePinned.affected === 0) {
      throw new NotFoundException('Note not found');
    }
    await this.activityService.create({
      userId,
      noteId: note.id,
      action: archived
        ? ActivityType.NOTE_ARCHIVED
        : ActivityType.NOTE_UNARCHIVED,
      message: `${archived ? 'Added to Archived' : 'Removed from Archived'} "${note.title}"`,
    });
    return { message: archived ? 'Archived' : 'UnArchived' };
  }

  async getArchieved(userId: string) {
    const notes = await this.noteRepo.findBy({
      archived: true,
      user: { id: userId },
    });
    return notes;
  }

  async getFavourite(userId: string) {
    const notes = await this.noteRepo.findBy({
      favorite: true,
      user: { id: userId },
    });
    return notes;
  }
}
