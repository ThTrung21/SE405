import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  @IsNotEmpty()
  public content: string;

  @IsOptional()
  @IsNumber()
  public userId?: number;

  @IsNotEmpty()
  @IsNumber()
  public rating: number;

  @IsNotEmpty()
  @IsNumber()
  public productId: number;
}

export class UpdateReviewDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  public content: string;

  @IsNumber()
  @IsOptional()
  public rating: number;

  @IsNotEmpty()
  @IsNumber()
  public productId: number;
}
