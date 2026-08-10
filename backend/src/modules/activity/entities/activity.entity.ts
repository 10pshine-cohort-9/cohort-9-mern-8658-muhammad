import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ActivityType } from '../enums/action.enum';
import { User } from 'src/modules/user/entities/user.entity';
import { Note } from 'src/modules/note/entities/note.entity';

@Entity()
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ActivityType })
  action: ActivityType;

  @Column()
  message: string;

  @ManyToOne(() => User, (users) => users.activities, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  user: User;

  @ManyToOne(() => Note, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  note: Note;

  @CreateDateColumn()
  createdAt: Date;
}
