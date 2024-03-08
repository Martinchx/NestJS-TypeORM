import { IsNumber, IsString, MinLength } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @MinLength(2)
  firstname: string;

  @IsString()
  @MinLength(2)
  lastname: string;

  @IsNumber()
  age: number;
}
