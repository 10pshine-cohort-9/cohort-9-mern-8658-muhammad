import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import type { AuthRequest } from '../auth/interface/auth-req.interface';

@Controller('note')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post()
  create(@Body() createNoteDto: CreateNoteDto ,@Req() req:AuthRequest) {
    return this.noteService.create(req.user.id, createNoteDto);
  }

  @Get()
  findAll(@Req() req:AuthRequest) {
    return this.noteService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string ,@Req() req:AuthRequest) {
    return this.noteService.findOne(id,req.user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto,@Req() req:AuthRequest) {
    return this.noteService.update(req.user.id,id, updateNoteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string,@Req() req:AuthRequest) {
    return this.noteService.remove(id,req.user.id);
  }
}
