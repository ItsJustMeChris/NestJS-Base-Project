import { FastifyRequest } from 'fastify';
import { User } from 'src/modules/users/users.entity';

export interface AuthenticatedRequest extends FastifyRequest {
  user: User;
}
