import { FastifyRequest } from 'fastify';

export interface AuthorizedRequest<T> extends FastifyRequest {
  user: T;
  token: string;
}
