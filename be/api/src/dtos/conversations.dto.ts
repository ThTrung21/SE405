import { ChatStatus, ChatType } from '@/interfaces/conversation.interface';
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateConversationDto {
  @IsNumber()
  @IsNotEmpty()
  public userId: number;
}

export class UpdateConversationDto {
  @IsNumber()
  @IsOptional()
  public staffId: number;

  @IsEnum(ChatStatus)
  @IsString()
  @IsNotEmpty()
  public status: string;

  @IsDate()
  @IsOptional()
  public expiresAt: string;
}
