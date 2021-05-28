import {
  Injectable,
  CanActivate,
  ExecutionContext,
  mixin,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JWT } from '../models/jwt.model';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const permissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );
    if (!permissions) {
      return false;
    }

    console.log(permissions);
    const request = context.switchToHttp().getRequest();
    const user: JWT = request.user;
    console.log(request.user);
    if (
      permissions.some((permission: string) => {
        return !user.permissions.includes(permission);
      })
    ) {
      console.log('no you missing a perm yo');
      return false;
    }
    return false;
  }
}
