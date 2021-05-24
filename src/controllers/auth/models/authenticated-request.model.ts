import { Request } from 'express';
import { User } from 'src/controllers/users/users.entity';

export interface AuthenticatedRequest extends Request {
  user: User;
}
