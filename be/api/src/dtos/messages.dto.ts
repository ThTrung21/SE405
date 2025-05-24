import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class SendMessageDto {
  @IsNumber()
  @IsNotEmpty()
  public conversationId: number;

  @IsNumber()
  @IsNotEmpty()
  public senderId: number;

  @IsNumber()
  @IsOptional()
  public productId: number;

  @IsNotEmpty()
  public content: string;
}
