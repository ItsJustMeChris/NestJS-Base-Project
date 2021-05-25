import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RefreshTokensService } from '../../refresh-tokens/refresh-tokens.service';
import { RefreshToken } from '../../refresh-tokens/refresh-tokens.entity';
import { AuthorizedRequest } from '../models/authorized-request.model';
import { RefreshJWT } from '../models/jwt.model';

@Injectable()
export class RefreshGuard extends AuthGuard('refresh') {
  constructor(private refreshTokensService: RefreshTokensService) {
    super();
  }

  async canActivate(ctx: ExecutionContext): Promise<any> {
    const req: AuthorizedRequest<RefreshJWT> = ctx.switchToHttp().getRequest();
    const bearerHeader = req.headers['authorization'];
    if (bearerHeader) {
      const bearer = bearerHeader.split(' ');
      const bearerToken = bearer[1];
      const refreshToken: RefreshToken =
        await this.refreshTokensService.findByToken(bearerToken);

      req.token = bearerToken;

      if (!refreshToken) {
        throw new UnauthorizedException();
      }
    }
    return super.canActivate(ctx);
  }
}
