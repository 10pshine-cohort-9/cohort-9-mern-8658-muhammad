import { Injectable } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from './entities/activity.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity) private actRepo: Repository<Activity>,
  ) {}
  async create(createActivityDto: CreateActivityDto) {
    const newactivity = this.actRepo.create({
      action: createActivityDto.action,
      message: createActivityDto.message,
      user: { id: createActivityDto.userId },
      note: createActivityDto.noteId
        ? { id: createActivityDto.noteId }
        : undefined,
    });
    return await this.actRepo.save(newactivity);
  }

  async findAll(userId: string) {
    const allAct = await this.actRepo.find({ where: { user: { id: userId } } });
    return allAct;
  }
}
