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
import { JWTGuard } from '../auth/guards/jwt.guard';
import { AuthorizedRequest } from '../auth/models/authorized-request.model';
import { JWT } from '../auth/models/jwt.model';
import { User } from '../users/users.entity';
import { Authenticator } from './authenticators.entity';
import { AuthenticatorsService } from './authenticators.service';

@Controller('authenticators')
export class AuthenticatorsController {
  constructor(private readonly authenticatorsService: AuthenticatorsService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JWTGuard)
  @Post('create')
  async create(
    @Req() req: AuthorizedRequest<JWT>,
    @Body() authenticator: Partial<Authenticator>,
  ) {
    try {
      return await this.authenticatorsService.create(
        new Authenticator({ ...authenticator, user: <User>req.user.user }),
      );
    } catch (err) {
      if (err && err.code === PG_UNIQUE_CONSTRAINT_VIOLATION) {
        return { error: null };
      }
    }
  }
}
