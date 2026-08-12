import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { DataSource, Repository } from 'typeorm';
import { ActivityService } from '../activity/activity.service';
import { ActivityType } from '../activity/enums/action.enum';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepo: Repository<Note>,
    private readonly activityService: ActivityService,
    private readonly dataSource: DataSource,
    private readonly logger: PinoLogger,
  ) {}

  async create(userId: string, createNoteDto: CreateNoteDto) {
    return this.dataSource.transaction(async (manager) => {
      const repo = manager.getRepository(Note);

      const note = repo.create({
        ...createNoteDto,
        user: { id: userId },
      });
      const savedNote = await repo.save(note);

      await this.activityService.create(
        {
          userId,
          noteId: savedNote.id,
          action: ActivityType.NOTE_CREATED,
          message: `Created "${savedNote.title}"`,
        },
        manager,
      );
      this.logger.info(
        {
          userId,
          notId: note.id,
        },
        'Note Created',
      );
      return savedNote;
    });
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

  async findOne(
    id: string,
    userId: string,
    repo: Repository<Note> = this.noteRepo,
  ) {
    const note = await repo.findOne({
      where: {
        user: {
          id: userId,
        },
        id: id,
      },
    });
    if (!note) {
      this.logger.warn({ userId, noteId: id }, 'Note no found');
      throw new NotFoundException('Note not found');
    }

    return note;
  }

  async update(userId: string, id: string, updateNoteDto: UpdateNoteDto) {
    return this.dataSource.transaction(async (manager) => {
      const repo = manager.getRepository(Note);

      const updatenote = await repo.update(
        { id, user: { id: userId } },
        updateNoteDto,
      );
      if (updatenote.affected === 0) {
        throw new NotFoundException('Note not found');
      }
      const note = await this.findOne(id, userId, repo);

      await this.activityService.create(
        {
          userId,
          noteId: note.id,
          action: ActivityType.NOTE_UPDATED,
          message: `Updated "${note.title}"`,
        },
        manager,
      );

      return note;
    });
  }

  async remove(id: string, userId: string) {
    return this.dataSource.transaction(async (manager) => {
      const repo = manager.getRepository(Note);

      const note = await this.findOne(id, userId, repo);

      const deletenote = await repo.delete({
        id: id,
        user: { id: userId },
      });
      if (deletenote.affected === 0) {
        throw new NotFoundException('Note not found');
      }
      await this.activityService.create(
        {
          userId,
          action: ActivityType.NOTE_DELETED,
          message: `Deleted "${note.title}"`,
        },
        manager,
      );
      this.logger.info(
        {
          userId,
          noteId: note.id,
        },
        'Note deleted',
      );
      return { message: 'Deleted Successfully' };
    });
  }

  async pinned(id: string, userId: string) {
    return this.dataSource.transaction(async (manager) => {
      const repo = manager.getRepository(Note);

      const note = await repo
        .createQueryBuilder('note')
        .leftJoin('note.user', 'user')
        .setLock('pessimistic_write')
        .where('note.id=:id', { id })
        .andWhere('user.id = :userId', { userId })
        .getOne();

      if (!note) {
        throw new NotFoundException('Note not found');
      }

      const pinned = !note.pinned;
      await repo.update({ id, user: { id: userId } }, { pinned });

      await this.activityService.create(
        {
          userId,
          noteId: note.id,
          action: pinned
            ? ActivityType.NOTE_PINNED
            : ActivityType.NOTE_UNPINNED,
          message: `${pinned ? 'Pinned' : 'UnPinned'} "${note.title}"`,
        },
        manager,
      );
      this.logger.info(
        {
          userId,
          noteId: note.id,
          pinned,
        },
        pinned ? 'Note pinned' : 'Note unpinned',
      );
      return {
        message: pinned ? 'Pinned' : 'UnPinned',
        note: {
          ...note,
          pinned,
        },
      };
    });
  }

  async favorite(id: string, userId: string) {
    return this.dataSource.transaction(async (manager) => {
      const repo = manager.getRepository(Note);

      const note = await repo
        .createQueryBuilder('note')
        .leftJoin('note.user', 'user')
        .setLock('pessimistic_write')
        .where('note.id=:id', { id })
        .andWhere('user.id = :userId', { userId })
        .getOne();

      if (!note) {
        throw new NotFoundException('Note not found');
      }

      const favorite = !note.favorite;
      const updatefavorite = await repo.update(
        { id: id, user: { id: userId } },
        { favorite },
      );
      if (updatefavorite.affected === 0) {
        throw new NotFoundException('Note not found');
      }
      await this.activityService.create(
        {
          userId,
          noteId: note.id,
          action: favorite
            ? ActivityType.NOTE_FAVORITED
            : ActivityType.NOTE_UNFAVORITED,
          message: `${favorite ? 'Added to favorites' : 'Removed from favorites'} "${note.title}"`,
        },
        manager,
      );

      this.logger.info(
        {
          userId,
          noteId: note.id,
          favorite,
        },
        favorite ? 'Note favorited' : 'Note unfavorited',
      );

      return {
        message: favorite ? 'Favorite' : 'UnFavorite',
        note: {
          ...note,
          favorite,
        },
      };
    });
  }

  async archived(id: string, userId: string) {
    return this.dataSource.transaction(async (manager) => {
      const repo = manager.getRepository(Note);

      const note = await repo
        .createQueryBuilder('note')
        .leftJoin('note.user', 'user')
        .setLock('pessimistic_write')
        .where('note.id=:id', { id })
        .andWhere('user.id = :userId', { userId })
        .getOne();

      if (!note) {
        throw new NotFoundException('Note not found');
      }

      const archived = !note.archived;
      const updatearchived = await repo.update(
        { id: id, user: { id: userId } },
        { archived },
      );
      if (updatearchived.affected === 0) {
        throw new NotFoundException('Note not found');
      }
      await this.activityService.create(
        {
          userId,
          noteId: note.id,
          action: archived
            ? ActivityType.NOTE_ARCHIVED
            : ActivityType.NOTE_UNARCHIVED,
          message: `${archived ? 'Added to Archived' : 'Removed from Archived'} "${note.title}"`,
        },
        manager,
      );
      this.logger.info(
        {
          userId,
          noteId: note.id,
          archived,
        },
        archived ? 'Note archived' : 'Note unarchived',
      );
      return {
        message: archived ? 'Archived' : 'UnArchived',
        note: {
          ...note,
          archived,
        },
      };
    });
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
