import { User } from 'src/modules/users/models/users.entity';

export interface JWT {
  sub: number;
  iat: string;
  exp: string;
  permissions: string[];
}

export type RefreshJWT = Omit<JWT, 'permissions'>;
