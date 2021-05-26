import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  index() {
    return {
      server: {
        api: 'NestJS Base',
        version: '0.1.0',
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
