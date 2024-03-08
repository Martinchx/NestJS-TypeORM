import { IsNumber, IsString, MinLength } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @MinLength(2)
  title: string;

  @IsString()
  @MinLength(5)
  content: string;

  @IsNumber()
  author_id: number;
}
