import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  BaseEntity,
  ManyToOne,
  Column,
  Index,
} from 'typeorm';
import { User } from '../../users/models/users.entity';

@Entity()
@Unique(['secret'])
@Unique('user_type', ['type', 'user'])
export class Authenticator extends BaseEntity {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  // TODO: Encrypt this value with a secret!
  @Exclude()
  @IsString()
  @IsNotEmpty()
  @Column()
  @Index()
  secret: string;

  @IsString()
  @IsNotEmpty()
  @Column()
  @Index()
  type: string;

  @Exclude()
  @ManyToOne(() => User, (user) => user.refreshTokens)
  user: User;

  constructor(partial: Partial<Authenticator>) {
    super();
    Object.assign(this, partial);
  }
}

export class TCreateAuthenticator {
  @IsString()
  @IsNotEmpty()
  secret: string;

  @IsString()
  @IsNotEmpty()
  type: string;
}

export class TCheckAuthenticator {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  type: string;
}
