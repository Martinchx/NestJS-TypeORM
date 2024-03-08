import { IsDateString, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(5)
  username: string;

  @IsString()
  @MinLength(5)
  password: string;

  @IsString()
  @IsDateString()
  @IsOptional()
  createdAt?: string;

  @IsString()
  @IsOptional()
  authStrategy?: string;
}
