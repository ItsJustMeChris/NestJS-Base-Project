import { FastifyRequest } from 'fastify';
import { User } from 'src/modules/users/models/users.entity';

export interface AuthenticatedRequest extends FastifyRequest {
  user: User;
}
