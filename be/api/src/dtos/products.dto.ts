import { IsString, IsNotEmpty, IsNumber, IsArray, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsNotEmpty()
  public desc: string;

  @IsNumber()
  @IsNotEmpty()
  public price: number;

  @IsNumber()
  @IsOptional()
  public importPrice: number;

  @IsNumber()
  @IsNotEmpty()
  public brandId: number;

  @IsNotEmpty()
  @IsNumber()
  public categoryId?: number;

  @IsNumber()
  @IsOptional()
  public sold: number;

  @IsString({ each: true })
  public images: string[];

  @IsNumber()
  public stock: number;

  @IsNumber()
  public score: number;
}

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  public description: string;

  @IsNumber()
  @IsOptional()
  public price: number;

  @IsNumber()
  @IsOptional()
  public brandId?: number;

  @IsNumber()
  @IsOptional()
  public categoryId?: number;

  @IsNumber()
  @IsOptional()
  public sold: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  public images: string[];

  @IsNumber()
  public stock: number;

  @IsNumber()
  public score: number;
}
