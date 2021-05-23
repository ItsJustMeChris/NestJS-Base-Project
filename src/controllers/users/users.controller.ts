import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { User } from './users.entity';
import { UsersService } from './users.service';

const PG_UNIQUE_CONSTRAINT_VIOLATION = '23505';

@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async getHello(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async createUser(
    @Body() user: Partial<User>,
  ): Promise<User | { error: string }> {
    try {
      return await this.usersService.create(new User(user));
    } catch (err) {
      if (err && err.code === PG_UNIQUE_CONSTRAINT_VIOLATION) {
        return { error: 'Already Exists' };
      }
    }
  }
}
