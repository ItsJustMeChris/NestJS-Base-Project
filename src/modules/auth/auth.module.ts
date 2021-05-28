import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/modules/users/users.module';
import { RefreshTokensModule } from '../refresh-tokens/refresh-tokens.module';
import { AuthController } from './controllers/auth.controller';
import { PermissionsGuard } from './guards/permissions.guard';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TwoFactorStrategy } from './strategies/local-2fa.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { RefreshStrategy } from './strategies/refresh.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    RefreshTokensModule,
    ConfigModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    TwoFactorStrategy,
    JwtStrategy,
    RefreshStrategy,
    PermissionsGuard,
  ],
  controllers: [AuthController],
  exports: [PermissionsGuard, AuthService],
})
export class AuthModule {}
