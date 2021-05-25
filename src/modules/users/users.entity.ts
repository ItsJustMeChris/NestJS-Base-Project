import { Exclude } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import { Authenticator } from '../authenticators/authenticators.entity';
import { RefreshToken } from '../refresh-tokens/refresh-tokens.entity';

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

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshToken[];

  @Exclude()
  @OneToMany(() => Authenticator, (authenticator) => authenticator.user)
  authenticators: Authenticator[];

  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }
}
