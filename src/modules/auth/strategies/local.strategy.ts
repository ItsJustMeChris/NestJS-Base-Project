import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { User } from 'src/modules/users/users.entity';
import { TwoFactorRequiredException } from '../models/2fa-exception.model';
import { classToPlain } from 'class-transformer';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {
    super();
  }

  async validate(username: string, password: string): Promise<User> {
    const user: User = await this.authService.validateUser(username, password);

    if (user.authenticators.length > 0) {
      throw new TwoFactorRequiredException({
        error: '2fa',
        valid: classToPlain(user.authenticators),
        accessToken: this.jwtService.sign(
          {
            user: classToPlain(user),
            sub: user.id,
          },
          {
            expiresIn: '1m',
            secret: this.configService.get<string>('JWT_SECRET_2FA'),
          },
        ),
      });
    }

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
