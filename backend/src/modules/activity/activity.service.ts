import { Injectable } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from './entities/activity.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity) private readonly actRepo: Repository<Activity>,
  ) {}
  async create(createActivityDto: CreateActivityDto, manager?: EntityManager) {
    const repo = manager ? manager.getRepository(Activity) : this.actRepo;

    const newactivity = repo.create({
      action: createActivityDto.action,
      message: createActivityDto.message,
      user: { id: createActivityDto.userId },
      note: createActivityDto.noteId
        ? { id: createActivityDto.noteId }
        : undefined,
    });
    return await repo.save(newactivity);
  }

  async findAll(userId: string) {
    const allAct = await this.actRepo.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
    return allAct;
  }
}
