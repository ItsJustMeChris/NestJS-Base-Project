import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { classToPlain } from 'class-transformer';
import { User } from 'src/modules/users/models/users.entity';
import { UsersService } from 'src/modules/users/services/users.service';
import { Authenticator } from '../../authenticators/models/authenticators.entity';
import { RefreshToken } from '../../refresh-tokens/models/refresh-tokens.entity';
import { authenticator as OTPAuthenticator } from 'otplib';
import { AuthenticatorsService } from 'src/modules/authenticators/services/authenticators.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly authenticatorsService: AuthenticatorsService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
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
        user: classToPlain(user),
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
        user: classToPlain(user),
        sub: user.id,
        refreshToken,
      }),
    };
  }

  async refresh(user: Partial<User>, refreshToken: string) {
    return {
      accessToken: this.jwtService.sign({
        user: classToPlain(user),
        sub: user.id,
        refreshToken,
      }),
    };
  }

  async authenticate(user: Partial<User>, token: string, type: string) {
    const authenticator: Authenticator =
      await this.authenticatorsService.findByUserType(user, { type });

    if (!authenticator) {
      return false;
    }

    const isValid: boolean = OTPAuthenticator.check(
      token,
      authenticator.secret,
    );

    return isValid;
  }
}
