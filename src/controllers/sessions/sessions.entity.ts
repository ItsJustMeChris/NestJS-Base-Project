import { Exclude } from 'class-transformer';
import { IsEmail, IsIP, IsJWT, IsNotEmpty } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  BaseEntity,
  ManyToOne,
} from 'typeorm';
import { User } from '../users/users.entity';

@Entity()
@Unique(['token'])
export class Session extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @Column()
  @IsJWT()
  token: string;

  @ManyToOne(() => User, (user) => user.sessions)
  user: User;

  @IsNotEmpty()
  @Column()
  @IsIP()
  ip: string;

  constructor(partial: Partial<Session>) {
    super();
    Object.assign(this, partial);
  }
}
