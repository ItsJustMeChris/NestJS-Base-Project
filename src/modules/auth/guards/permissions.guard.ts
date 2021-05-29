import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { isArray } from 'class-validator';
import { JWT } from '../models/jwt.model';

export interface Permission {
  model: string;
  allowances: number;
}

export enum PERMISSION {
  NONE = 0,

  CREATE = 1,
  READ = 10,
  UPDATE = 100,
  DELETE = 1000,

  ANY = 1111,
}

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const permissions = this.reflector.get<Permission[] & Permission[][]>(
      'permissions',
      context.getHandler(),
    );

    if (!permissions) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const user: JWT = request.user;

    if (
      permissions.filter((permission: Permission | Permission[]) => {
        if (isArray(permission)) {
          const perms: Permission[] = <Permission[]>permission;
          return perms.some((perm: Permission) => {
            return user.permissions.some(
              (p) =>
                p.model === perm.model &&
                (perm.allowances === PERMISSION.ANY ||
                  p.allowances & perm.allowances),
            );
          });
        }

        const perm: Permission = <Permission>permission;

        return user.permissions.some(
          (p) =>
            p.model === perm.model &&
            (perm.allowances === PERMISSION.ANY ||
              p.allowances & perm.allowances),
        );
      }).length !== permissions.length
    ) {
      return false;
    }
    return true;
  }
}
