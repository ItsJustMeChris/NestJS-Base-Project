import { HttpException, HttpStatus } from '@nestjs/common';

export class TwoFactorRequiredException extends HttpException {
  constructor(message: unknown) {
    super(message, HttpStatus.OK);
  }
}
