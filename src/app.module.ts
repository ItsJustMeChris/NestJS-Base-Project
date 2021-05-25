import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './modules/users/users.entity';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RefreshTokensController } from './modules/refresh-tokens/refresh-tokens.controller';
import { RefreshToken } from './modules/refresh-tokens/refresh-tokens.entity';
import { AuthenticatorsModule } from './modules/authenticators/authenticators.module';
import { Authenticator } from './modules/authenticators/authenticators.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: 5432,
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASS'),
        database: configService.get<string>('DB_NAME'),
        entities: [User, RefreshToken, Authenticator],
        synchronize: true,
      }),
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    AuthenticatorsModule,
  ],
  controllers: [AppController, RefreshTokensController],
  providers: [AppService],
})
export class AppModule {}
