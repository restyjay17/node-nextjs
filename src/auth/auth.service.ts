import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

import * as bcrypt from 'bcrypt';
import { EncryptionService } from '@hedger/nestjs-encryption';
import { JwtService } from '@nestjs/jwt';
import { VerifyPayloadDto } from './dto/verify.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private crypto: EncryptionService,
    private jwt: JwtService,
  ) {}

  async validateUser({ email, password }: AuthPayloadDto) {
    const findUser = await this.userRepository.findOne({ where: { email } });

    if (!findUser) throw new UnauthorizedException('Invalid user credentials');

    const adminPassword = (await findUser).password;
    const isMatch = await bcrypt.compareSync(password, adminPassword);

    if (!isMatch) throw new UnauthorizedException('Invalid user credentials');

    const userid = (await findUser).user_id;
    const status = (await findUser).status;

    // check if user account is suspended
    if (status === 2) throw new UnauthorizedException('Account is suspended');

    // check if user is for verification
    if (status === 0)
      throw new NotAcceptableException(
        this.crypto.encrypt(userid.toString()),
        'for verification',
      );

    // create JWT token
    const payload = {
      id: userid,
      name: findUser.first_name + ' ' + findUser.last_name,
      access: findUser.access_type,
      role: findUser.role,
    };
    return this.jwt.signAsync(payload);
  }

  async verifyUserAccount(verifyPayloadDto: VerifyPayloadDto) {
    const decryptId = this.crypto.decrypt(verifyPayloadDto.id);
    const userid = parseInt(decryptId);
    const user = await this.userRepository.findOne({
      where: { user_id: userid },
    });

    if (!user) throw new NotFoundException();

    if (user.status > 0)
      throw new BadRequestException('Account already verified');

    // remove id
    delete verifyPayloadDto.id;

    verifyPayloadDto.status = 1;
    Object.assign(user, verifyPayloadDto);

    const save = await this.userRepository.save(user);

    if (!save)
      throw new BadRequestException(
        'Something went wrong while verifying user',
      );

    // create JWT token
    const payload = {
      id: userid,
      name: user.first_name + ' ' + user.last_name,
      access: user.access_type,
      role: user.role,
    };
    return this.jwt.signAsync(payload);
  }
}
