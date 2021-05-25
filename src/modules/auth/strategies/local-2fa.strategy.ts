import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JWT } from '../models/jwt.model';

@Injectable()
export class TwoFactorStrategy extends PassportStrategy(Strategy, '2fa') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET_2FA'),
    });
  }

  async validate(payload: JWT): Promise<JWT> {
    return payload;
  }
}
