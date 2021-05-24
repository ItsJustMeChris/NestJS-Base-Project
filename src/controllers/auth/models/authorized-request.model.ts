import { Request } from 'express';

export interface AuthorizedRequest<T> extends Request {
  user: T;
  token: string;
}
