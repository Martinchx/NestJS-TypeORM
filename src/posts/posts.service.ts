import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dtos';
import { Post } from './entities';
import { PaginationDto } from 'src/common';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postsRepository: Repository<Post>,
    private readonly usersService: UsersService,
  ) {}

  async createPost(createPostDto: CreatePostDto) {
    const userFound = await this.usersService.getUser(createPostDto.author_id);

    if (!userFound)
      throw new HttpException(
        `User #${createPostDto.author_id} does not exist`,
        HttpStatus.NOT_FOUND,
      );

    const newPost = this.postsRepository.create(createPostDto);
    newPost.author = userFound;
    return await this.postsRepository.save(newPost);
  }

  async getAllPosts(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    return await this.postsRepository.find({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['author'],
    });
  }
}
