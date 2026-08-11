import { Module } from '@nestjs/common';
import { NoteService } from './note.service';
import { NoteController } from './note.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { UserModule } from '../user/user.module';
import { ActivityModule } from '../activity/activity.module';

@Module({
  imports: [TypeOrmModule.forFeature([Note]), UserModule, ActivityModule],
  controllers: [NoteController],
  providers: [NoteService],
})
export class NoteModule {}
