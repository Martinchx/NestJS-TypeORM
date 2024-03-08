import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile, User } from './entities';
import { CreateProfileDto, CreateUserDto, UpdateUserDto } from './dtos';
import { PaginationDto } from 'src/common';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create(createUserDto);
    await this.userRepository.save(newUser);
    return newUser;
  }

  async getAllUsers(paginationDto: PaginationDto): Promise<User[]> {
    const { page, limit } = paginationDto;

    const users = await this.userRepository.find({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['profile', 'posts'],
    });
    return users;
  }

  async getUser(user_id: number): Promise<User> {
    const userFound = await this.userRepository.findOne({
      where: {
        user_id,
      },
    });

    if (!userFound)
      throw new HttpException(
        `User #${user_id} does not exist`,
        HttpStatus.NOT_FOUND,
      );

    return userFound;
  }

  async updateUser(user_id: number, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userRepository.update(
      user_id,
      updateUserDto,
    );

    if (updatedUser.affected === 0)
      throw new HttpException(
        `User #${user_id} does not exist`,
        HttpStatus.NOT_FOUND,
      );

    return await this.getUser(user_id);
  }

  async deleteUser(user_id: number): Promise<Boolean> {
    const userDeleted = await this.userRepository.delete(user_id);

    if (userDeleted.affected === 0)
      throw new HttpException(`User does not exist`, HttpStatus.NOT_FOUND);

    return true;
  }

  async createProfile(user_id: number, createProfileDto: CreateProfileDto) {
    const userFound = await this.userRepository.findOne({ where: { user_id } });

    if (!userFound)
      throw new HttpException(
        `User #${user_id} does not exist`,
        HttpStatus.NOT_FOUND,
      );

    const newProfile = this.profileRepository.create(createProfileDto);
    const savedProfile = await this.profileRepository.save(newProfile);
    userFound.profile = savedProfile;

    return await this.userRepository.save(userFound);
  }
}
