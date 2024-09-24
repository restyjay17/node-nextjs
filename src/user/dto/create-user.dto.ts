import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';
import { IsUnique } from 'src/shared/validation/is-unique';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @IsUnique({ tableName: 'users', column: 'email' })
  email: string;

  password: string;

  @IsNotEmpty()
  last_name: string;

  @IsNotEmpty()
  first_name: string;

  @IsNumber()
  contact_number: number;

  address: string;

  @IsNotEmpty()
  @IsNumber()
  status: number;

  @IsNotEmpty()
  @IsNumber()
  role: number;

  @IsNotEmpty()
  @IsNumber()
  access_type: number;

  following: any;
}
