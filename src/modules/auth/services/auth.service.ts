import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/modules/users/models/users.entity';
import { UsersService } from 'src/modules/users/services/users.service';
import { RefreshToken } from '../../refresh-tokens/models/refresh-tokens.entity';
import { PERMISSION } from '../guards/permissions.guard';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user: User = await this.usersService.findByString(username);
    if (user && (await bcrypt.compare(pass, user.password))) {
      return user;
    }
    return null;
  }

  // TODO: Track logins
  async login(user: Partial<User>, ip: string, userAgent: string) {
    const refreshToken = this.jwtService.sign(
      {
        sub: user.id,
      },
      {
        expiresIn: '7d',
        secret: this.configService.get<string>('JWT_SECRET_REFRESH'),
      },
    );

    await new RefreshToken({
      token: refreshToken,
      user: <User>user,
      ip,
    }).save();

    return {
      accessToken: this.jwtService.sign({
        sub: user.id,
        // TODO: Permission modeling.
        permissions: [
          // { model: 'authenticators', allowances: PERMISSION.UPDATE },
          // { model: 'abc', allowances: PERMISSION.CREATE },
        ],
      }),
      refreshToken,
    };
  }

  async refresh(user: Partial<User>) {
    return {
      accessToken: this.jwtService.sign({
        sub: user.id,
        // TODO: Permission modeling.
        permissions: [],
      }),
    };
  }
}
