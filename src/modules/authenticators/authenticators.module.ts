import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { AuthenticatorsController } from './controllers/authenticators.controller';
import { Authenticator } from './models/authenticators.entity';
import { AuthenticatorsService } from './services/authenticators.service';

@Module({
  imports: [TypeOrmModule.forFeature([Authenticator]), UsersModule],
  providers: [AuthenticatorsService],
  controllers: [AuthenticatorsController],
  exports: [AuthenticatorsService],
})
export class AuthenticatorsModule {}
