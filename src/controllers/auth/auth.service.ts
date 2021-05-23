import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { classToPlain } from 'class-transformer';
import { User } from 'src/controllers/users/users.entity';
import { UsersService } from 'src/controllers/users/users.service';
import { Session } from '../sessions/sessions.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByString(username);
    if (user && (await bcrypt.compare(pass, user.password))) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const refreshToken = this.jwtService.sign(
      {
        user: classToPlain(user),
        sub: user.id,
      },
      {
        expiresIn: '7d',
      },
    );

    // TODO: IP Address For Sessions
    await new Session({ token: refreshToken, user, ip: '127.0.0.1' }).save();

    return {
      accessToken: this.jwtService.sign({
        user: classToPlain(user),
        sub: user.id,
      }),
      refreshToken,
    };
  }
}
