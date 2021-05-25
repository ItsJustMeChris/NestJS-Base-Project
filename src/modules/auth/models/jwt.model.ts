import { User } from 'src/modules/users/models/users.entity';

export interface RefreshJWT {
  user: Partial<User>;
  sub: number;
  iat: string;
  exp: string;
}

export interface JWT extends RefreshJWT {
  refreshToken: string;
}
