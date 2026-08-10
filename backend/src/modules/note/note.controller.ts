import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import type { AuthRequest } from '../auth/interface/auth-req.interface';

@Controller('note')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post()
  create(@Body() createNoteDto: CreateNoteDto, @Req() req: AuthRequest) {
    return this.noteService.create(req.user.id, createNoteDto);
  }

  @Get()
  findAll(@Req() req: AuthRequest) {
    return this.noteService.findAll(req.user.id);
  }

  @Get('archived')
  getarchived(@Req() req: AuthRequest) {
    return this.noteService.getArchieved(req.user.id);
  }

  @Get('favorite')
  getfavorite(@Req() req: AuthRequest) {
    return this.noteService.getFavourite(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.noteService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
    @Req() req: AuthRequest,
  ) {
    return this.noteService.update(req.user.id, id, updateNoteDto);
  }

  @Patch(':id/pinned')
  pinned(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.noteService.pinned(id, req.user.id);
  }

  @Patch(':id/favorite')
  favorite(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.noteService.favorite(id, req.user.id);
  }

  @Patch(':id/archived')
  archived(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.noteService.archived(id, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.noteService.remove(id, req.user.id);
  }
}
