import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/users/models/users.entity';
import { Repository } from 'typeorm';
import { Authenticator } from '../models/authenticators.entity';

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
