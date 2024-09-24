import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';
import { IsUnique } from 'src/shared/validation/is-unique';

export class CreateCustomerDto {
  @IsEmail()
  @IsUnique({ tableName: 'customers', column: 'email' })
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  first_name: string;

  @IsNotEmpty()
  last_name: string;

  @IsNumber()
  @IsNotEmpty()
  status: number;
}
