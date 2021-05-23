import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SessionService } from '../sessions/session.service';
import { Session } from '../sessions/sessions.entity';

@Injectable()
export class RefreshGuard extends AuthGuard('refresh') {
  constructor(private sessionService: SessionService) {
    super();
  }

  async canActivate(ctx: ExecutionContext): Promise<any> {
    const req: Request = ctx.switchToHttp().getRequest();
    const bearerHeader = req.headers['authorization'];
    if (bearerHeader) {
      const bearer = bearerHeader.split(' ');
      const bearerToken = bearer[1];
      const session: Session = await this.sessionService.findByToken(
        bearerToken,
      );

      if (!session) {
        throw new UnauthorizedException();
      }
    }
    return super.canActivate(ctx);
  }
}
