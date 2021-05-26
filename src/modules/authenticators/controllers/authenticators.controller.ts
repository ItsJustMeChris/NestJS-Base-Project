import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PG_UNIQUE_CONSTRAINT_VIOLATION } from 'src/helpers/types/postgres-errors.types';
import { JWTGuard } from 'src/modules/auth/guards/jwt.guard';
import { AuthorizedRequest } from 'src/modules/auth/models/authorized-request.model';
import { JWT } from 'src/modules/auth/models/jwt.model';
import { User } from 'src/modules/users/models/users.entity';
import {
  Authenticator,
  TCreateAuthenticator,
} from '../models/authenticators.entity';
import { AuthenticatorsService } from '../services/authenticators.service';

@Controller('authenticators')
export class AuthenticatorsController {
  constructor(private readonly authenticatorsService: AuthenticatorsService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JWTGuard)
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
