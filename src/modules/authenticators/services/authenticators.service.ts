import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/users.entity';
import { Authenticator } from './authenticators.entity';

@Injectable()
export class AuthenticatorsService {
  constructor(
    @InjectRepository(Authenticator)
    private authenticatorRepository: Repository<Authenticator>,
  ) {}

  async findByUserType(
    user: Partial<User>,
    authenticator: Partial<Authenticator>,
  ) {
    return this.authenticatorRepository.findOne({
      where: {
        user: user.id,
        type: authenticator.type,
      },
    });
  }

  async create(authenticator: Partial<Authenticator>): Promise<Authenticator> {
    return authenticator.save();
  }
}
