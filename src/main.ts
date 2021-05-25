import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import * as fs from 'fs';
import { AppConfigModule } from './app-config.module';

async function bootstrap() {
  const ctx = await NestFactory.createApplicationContext(AppConfigModule);
  const configService = ctx.get(ConfigService);

  // Config service doesn't cast programmatically
  const isHTTP2 = configService.get<string>('HTTP2') === 'true';
  const isHTTPS = configService.get<string>('HTTPS') === 'true';

  const config = {
    http2: isHTTP2 && isHTTPS,
    https: {
      allowHTTP1: true,
      key: fs.readFileSync(configService.get<string>('SSL_KEY')),
      cert: fs.readFileSync(configService.get<string>('SSL_CERT')),
    },
  };

  if (!isHTTPS) {
    delete config.https;
  }

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(config),
  );

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(configService.get<number>('SERVER_PORT'));
  console.log('Server is ready @', await app.getUrl());
}
bootstrap();
