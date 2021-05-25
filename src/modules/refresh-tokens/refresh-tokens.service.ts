import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from './refresh-tokens.entity';

@Injectable()
export class RefreshTokensService {
  constructor(
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async findByToken(token: string): Promise<RefreshToken> {
    return this.refreshTokenRepository.findOne({
      where: {
        token,
      },
    });
  }

  async remove(id: number): Promise<void> {
    await this.refreshTokenRepository.delete(id);
  }

  //   async create(user: Partial<User>): Promise<User> {
  //     user.password = await bcrypt.hash(user.password, 10);
  //     return user.save();
  //   }
}
