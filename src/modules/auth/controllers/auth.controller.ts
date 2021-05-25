import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FastifyRequest } from 'fastify';
import { PG_UNIQUE_CONSTRAINT_VIOLATION } from 'src/helpers/types/postgres-errors.types';
import { TCheckAuthenticator } from '../../authenticators/models/authenticators.entity';
import { TCreateUser, User } from '../../users/models/users.entity';
import { UsersService } from '../../users/services/users.service';
import { AuthService } from '../services/auth.service';
import { JWTGuard } from '../guards/jwt.guard';
import { RefreshGuard } from '../guards/refresh.guard';
import { AuthenticatedRequest } from '../models/authenticated-request.model';
import { AuthorizedRequest } from '../models/authorized-request.model';
import { JWT, RefreshJWT } from '../models/jwt.model';

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req: AuthenticatedRequest) {
    return this.authService.login(req.user, req.ip, req.headers['user-agent']);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register')
  async register(@Body() user: TCreateUser, @Req() req: FastifyRequest) {
    try {
      const u: User = await this.usersService.create(new User(user));
      return this.authService.login(u, req.ip, req.headers['user-agent']);
    } catch (err) {
      if (err && err.code === PG_UNIQUE_CONSTRAINT_VIOLATION) {
        return { error: 'Username or Email is Taken' };
      }
      throw new HttpException(
        { error: 'unknown' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(AuthGuard('2fa'))
  @Post('authenticate')
  async authenticate(
    @Req() req: AuthorizedRequest<JWT>,
    @Body() body: TCheckAuthenticator,
  ) {
    const authenticatorValid: boolean = await this.authService.authenticate(
      req.user.user,
      body.token,
      body.type,
    );

    if (authenticatorValid) {
      return this.authService.login(
        req.user.user,
        req.ip,
        req.headers['user-agent'],
      );
    }
    return { error: null };
  }

  @UseGuards(RefreshGuard)
  @Get('refresh')
  async refresh(@Req() req: AuthorizedRequest<RefreshJWT>) {
    return this.authService.refresh(req.user.user, req.token);
  }

  @UseGuards(RefreshGuard)
  @Get('validate-refresh')
  async validateRefresh(@Req() req: AuthorizedRequest<RefreshJWT>) {
    return req.user;
  }

  @UseGuards(JWTGuard)
  @Get('validate')
  async validate(@Req() req: AuthorizedRequest<JWT>) {
    return req.user;
  }
}
