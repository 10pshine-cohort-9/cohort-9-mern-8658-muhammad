import { Controller, Get, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import type { AuthRequest } from '../auth/interface/auth-req.interface';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findOne(@Req() req) {
    return this.userService.userProfile(req.user.id);
  }

  @Patch()
  update(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(req.user.id, updateUserDto);
  }

  @Delete()
  remove(@Req() req:AuthRequest) {
    return this.userService.remove(req.user.id);
  }
}
