import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoriesDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  desc: string;
}
