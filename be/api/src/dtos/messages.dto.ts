import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateMessageDto {
  @IsNumber()
  @IsNotEmpty()
  public conversationId: number;

  @IsNumber()
  @IsNotEmpty()
  public senderId: number;

  @IsNumber()
  @IsOptional()
  public productId: number;
}
