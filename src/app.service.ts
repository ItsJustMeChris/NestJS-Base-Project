import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as pkg from '../package.json';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  index() {
    return {
      server: {
        api: pkg.name,
        version: pkg.version,
        serverTime: new Date(),
      },
      config: {
        http2:
          this.configService.get<string>('HTTP2') === 'true' &&
          this.configService.get<string>('HTTPS') === 'true',
        https: this.configService.get<string>('HTTPS') === 'true',
      },
    };
  }
}
