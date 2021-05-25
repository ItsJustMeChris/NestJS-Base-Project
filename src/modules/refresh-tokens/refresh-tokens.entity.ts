import { IsIP, IsJWT, IsNotEmpty } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  BaseEntity,
  ManyToOne,
  Index,
} from 'typeorm';
import { User } from '../users/users.entity';

@Entity()
@Unique(['token'])
export class RefreshToken extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @Column()
  @IsJWT()
  @Index()
  token: string;

  @ManyToOne(() => User, (user) => user.refreshTokens)
  user: User;

  @IsNotEmpty()
  @Column()
  @IsIP()
  ip: string;

  constructor(partial: Partial<RefreshToken>) {
    super();
    Object.assign(this, partial);
  }
}
