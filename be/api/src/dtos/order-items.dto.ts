import { IsNotEmpty } from 'class-validator';

export class CreateOrderItemDto {
  @IsNotEmpty()
  public id: number;

  @IsNotEmpty()
  public productId: number;

  @IsNotEmpty()
  public orderId: number;

  @IsNotEmpty()
  public quantity: number;
}
