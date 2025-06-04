import { OrderStatus } from '@/interfaces/orders.interface';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class ProductItem {
  @IsNumber()
  public productId: number;

  @IsNumber()
  public quantity: number;

  // @IsNumber()
  // public sumPrice: number;
}

export class CreateOrderDto {
  @IsString()
  public receiptAddress?: string;

  @IsString()
  public receiptName: string;

  @IsString()
  public receiptPhone: string;

  @IsNotEmpty()
  public orderPrice: number;

  @IsEnum(OrderStatus)
  @IsOptional()
  public status?: OrderStatus;

  @ValidateNested()
  @Type(() => ProductItem)
  public products: ProductItem[];
}

export class UpdateOrderDto {
  @IsString()
  @IsOptional()
  public receiptAddress?: string;

  @IsString()
  @IsOptional()
  public receiptName?: string;

  @IsString()
  @IsOptional()
  public receiptPhone?: string;

  @IsEnum(OrderStatus)
  @IsOptional()
  public status?: OrderStatus;
}
