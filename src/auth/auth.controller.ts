import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { VerifyPayloadDto } from './dto/verify.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  login(@Body() authPayload: AuthPayloadDto) {
    const user = this.authService.validateUser(authPayload);
    return user;
  }

  @Post('verify')
  verifyAccount(@Body() payload: VerifyPayloadDto) {
    return this.authService.verifyUserAccount(payload);
  }
}
