import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ActivityType } from '../enums/action.enum';

export class CreateActivityDto {
  @IsString()
  userId: string;

  @IsEnum(ActivityType)
  action: ActivityType;

  @IsString()
  message: string;

  @IsString()
  @IsOptional()
  noteId?: string;
}
