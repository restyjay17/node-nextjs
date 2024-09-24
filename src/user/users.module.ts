import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { LogsService } from 'src/logs/logs.service';
import { Log } from 'src/logs/entities/log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Log])],
  controllers: [UsersController],
  providers: [UsersService, LogsService],
})
export class UsersModule {}
