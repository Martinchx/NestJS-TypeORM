import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user_profile' })
export class Profile {
  @PrimaryGeneratedColumn()
  profile_id: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  age: number;
}
