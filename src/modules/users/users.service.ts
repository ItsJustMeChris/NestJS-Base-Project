import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findByString(key: string): Promise<User> {
    return this.usersRepository.findOne({
      where: `User.username ILIKE '${key.toLocaleLowerCase()}' OR User.email ILIKE '${key.toLocaleLowerCase()}'`,
      relations: ['authenticators'],
    });
  }

  async findByID(id: number): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async create(user: Partial<User>): Promise<User> {
    user.password = await bcrypt.hash(user.password, 10);
    return user.save();
  }
}
