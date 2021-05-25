import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthorizedRequest } from '../models/authorized-request.model';
import { JWT } from '../models/jwt.model';

@Injectable()
export class JWTGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }

  async canActivate(ctx: ExecutionContext): Promise<any> {
    const req: AuthorizedRequest<JWT> = ctx.switchToHttp().getRequest();
    const bearerHeader = req.headers['authorization'];
    if (bearerHeader) {
      const bearer = bearerHeader.split(' ');
      const bearerToken = bearer[1];

      req.token = bearerToken;
    }
    return super.canActivate(ctx);
  }
}
