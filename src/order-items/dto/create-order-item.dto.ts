import { IsDecimal, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOrderItemDto {
  @IsNumber()
  @IsNotEmpty()
  order_id: any;

  @IsNumber()
  @IsNotEmpty()
  product_id: any;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsDecimal()
  @IsNotEmpty()
  price: number;

  @IsDecimal()
  @IsNotEmpty()
  total_price: number;
}
