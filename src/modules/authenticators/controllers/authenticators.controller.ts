import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PG_UNIQUE_CONSTRAINT_VIOLATION } from 'src/helpers/types/postgres-errors.types';
import { Permissions } from 'src/modules/auth/decorators/permissions.decorator';
import { JWTGuard } from 'src/modules/auth/guards/jwt.guard';
import { PermissionsGuard } from 'src/modules/auth/guards/permissions.guard';
import { AuthorizedRequest } from 'src/modules/auth/models/authorized-request.model';
import { JWT } from 'src/modules/auth/models/jwt.model';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { User } from 'src/modules/users/models/users.entity';
import {
  Authenticator,
  TCheckAuthenticator,
  TCreateAuthenticator,
} from '../models/authenticators.entity';
import { AuthenticatorsService } from '../services/authenticators.service';

@Controller('authenticators')
export class AuthenticatorsController {
  constructor(
    private readonly authenticatorsService: AuthenticatorsService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(AuthGuard('2fa'))
  @Post('authenticate')
  async authenticate(
    @Req() req: AuthorizedRequest<JWT>,
    @Body() { token, type, password }: TCheckAuthenticator,
  ) {
    const authenticatorValid: boolean =
      await this.authenticatorsService.authenticate(
        { id: req.user.sub, password },
        token,
        type,
      );

    if (authenticatorValid) {
      return this.authService.login(
        { id: req.user.sub },
        req.ip,
        req.headers['user-agent'],
      );
    }
    throw new UnauthorizedException({ error: null });
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JWTGuard, PermissionsGuard)
  @Permissions('unknown')
  @Post('create')
  async create(
    @Req() req: AuthorizedRequest<JWT>,
    @Body() { secret, password, type, recovery }: TCreateAuthenticator,
  ) {
    try {
      return await this.authenticatorsService.create(
        new Authenticator({
          secret,
          type,
          recovery,
          user: <User>{ id: req.user.sub },
        }),
        password,
      );
    } catch (err) {
      if (err && err.code === PG_UNIQUE_CONSTRAINT_VIOLATION) {
        return { error: null };
      }
      throw err;
    }
  }
}
