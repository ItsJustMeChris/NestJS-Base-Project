import { User } from 'src/modules/users/models/users.entity';
import { Permission } from '../guards/permissions.guard';

export interface JWT {
  sub: number;
  iat: string;
  exp: string;
  permissions: Permission[];
}

export type RefreshJWT = Omit<JWT, 'permissions'>;
