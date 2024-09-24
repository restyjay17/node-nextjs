import { IsDecimal, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  @IsNotEmpty()
  user_id: any;

  @IsNotEmpty()
  status: string;

  @IsDecimal()
  @IsNotEmpty()
  total_amount: number;
}
