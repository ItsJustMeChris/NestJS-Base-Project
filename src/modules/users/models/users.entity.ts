import { OmitType, PartialType, PickType } from '@nestjs/mapped-types';
import { Exclude } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import { Authenticator } from '../../authenticators/models/authenticators.entity';
import { RefreshToken } from '../../refresh-tokens/models/refresh-tokens.entity';

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

// export class TCreateUser extends PartialType(
//   PickType(User, ['username', 'password', 'email'] as const),
// ) {}

export class TCreateUser {
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
