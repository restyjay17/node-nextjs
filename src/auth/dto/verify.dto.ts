import { IsNotEmpty } from 'class-validator';

export class VerifyPayloadDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  password: string;

  status: number;
}
