import { Exclude } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  BaseEntity,
} from 'typeorm';

@Entity()
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @Column()
  username: string;

  @IsNotEmpty()
  @Column()
  @IsEmail()
  email: string;

  @Exclude()
  @Column()
  @IsNotEmpty()
  password: string;

  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }
}
