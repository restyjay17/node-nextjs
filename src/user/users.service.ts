import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LogsService } from 'src/logs/logs.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private logsService: LogsService,
  ) {}

  async create(userData: any, createUserDto: CreateUserDto) {
    createUserDto.following = userData.id;

    if (userData.access === 2) {
      if (createUserDto.access_type === 1) createUserDto.access_type = 2;
    } else if (userData.access === 3) {
      if (createUserDto.access_type === 1 || createUserDto.access_type === 2)
        createUserDto.access_type = 3;
    }

    // save log
    const logsdata = {
      module: 'user',
      action:
        'create new user ' +
        createUserDto.first_name +
        ' ' +
        createUserDto.last_name +
        ' by ' +
        userData.name,
      data: createUserDto,
      created_by: userData.id,
    };
    await this.logsService.create(logsdata);

    const user = this.userRepository.create(createUserDto);

    return await this.userRepository.save(user);
  }

  async findAll(userData: any) {
    if (userData.access !== 1) throw new UnauthorizedException();

    return await this.userRepository.find();
  }

  async findOne(id: number) {
    return await this.userRepository.findOne({
      where: { user_id: id },
    });
  }

  async update(userData: any, id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    if (!user) throw new NotFoundException();

    // remove following id
    delete updateUserDto.following;

    Object.assign(user, updateUserDto);

    // save log
    const logsdata = {
      module: 'user',
      action:
        'updated user details of ' +
        user.first_name +
        ' ' +
        user.last_name +
        ' by ' +
        userData.name,
      data: updateUserDto,
      created_by: userData.id,
    };
    await this.logsService.create(logsdata);

    return await this.userRepository.save(user);
  }

  async remove(userData: any, id: number) {
    const user = await this.userRepository.findOne({
      where: { user_id: id, following: { user_id: userData.id } },
    });

    if (!user) throw new UnauthorizedException();

    return await this.userRepository.remove(user);
  }

  async findUserFollowers(id: number) {
    try {
      return await this.userRepository.find({
        where: {
          user_id: id,
        },
        relations: {
          followers: true,
          following: true,
        },
        select: {
          user_id: true,
          email: true,
          last_name: true,
          first_name: true,
          contact_number: true,
          address: true,
          followers: {
            user_id: true,
            last_name: true,
            first_name: true,
          },
          following: {
            user_id: true,
            last_name: true,
            first_name: true,
          },
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
