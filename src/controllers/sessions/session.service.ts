import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Session } from './sessions.entity';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
  ) {}

  async findByToken(token: string): Promise<Session> {
    return this.sessionRepository.findOne({
      where: {
        token,
      },
    });
  }

  async remove(id: number): Promise<void> {
    await this.sessionRepository.delete(id);
  }

  //   async create(user: Partial<User>): Promise<User> {
  //     user.password = await bcrypt.hash(user.password, 10);
  //     return user.save();
  //   }
}
