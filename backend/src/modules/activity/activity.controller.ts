import { Controller, Get, Req } from '@nestjs/common';
import { ActivityService } from './activity.service';

import type{ AuthRequest } from '../auth/interface/auth-req.interface';

@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get()
  findAll(@Req() req:AuthRequest) {
    return this.activityService.findAll(req.user.id);
  }

}
