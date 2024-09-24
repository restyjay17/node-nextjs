import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Request } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Req() request: Request, @Body() createUserDto: CreateUserDto) {
    return this.usersService.create(request.user, createUserDto);
  }

  @Get()
  findAll(@Req() request: Request) {
    return this.usersService.findAll(request);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Req() request: Request,
    @Param('id') id: number,
    @Body() updateAdminDto: UpdateUserDto,
  ) {
    return this.usersService.update(request.user, +id, updateAdminDto);
  }

  @Delete(':id')
  remove(@Req() request: Request, @Param('id') id: number) {
    return this.usersService.remove(request.user, +id);
  }

  @Get('followers/:id')
  findAdmins(@Param('id') id: number) {
    return this.usersService.findUserFollowers(+id);
  }
}
