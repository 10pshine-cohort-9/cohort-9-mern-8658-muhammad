import { Controller, Get, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.userService.create(createUserDto);
  // }



  // @Get()
  // findAll() {
  //   return this.userService.findAll();
  // }

  @Get()
  findOne(@Req() req) {
    return this.userService.userProfile(req.user.id);
  }

  @Patch()
  update(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(req.user.id, updateUserDto);
  }

  @Delete()
  remove(@Req() req) {
    return this.userService.remove(req.user.id);
  }
}
