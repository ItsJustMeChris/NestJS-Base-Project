import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JWTGuard } from './guards/jwt.guard';
import { RefreshGuard } from './guards/refresh.guard';
import { AuthenticatedRequest } from './models/authenticated-request.model';
import { AuthorizedRequest } from './models/authorized-request.model';
import { JWT, RefreshJWT } from './models/jwt.model';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req: AuthenticatedRequest) {
    return this.authService.login(req.user);
  }

  @UseGuards(RefreshGuard)
  @Get('refresh')
  async refresh(@Req() req) {
    return this.authService.refresh(req.user, req.token);
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
