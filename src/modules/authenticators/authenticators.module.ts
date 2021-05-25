import { Module } from '@nestjs/common';
import { AuthenticatorsService } from './authenticators.service';
import { AuthenticatorsController } from './authenticators.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Authenticator } from './authenticators.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Authenticator])],
  providers: [AuthenticatorsService],
  controllers: [AuthenticatorsController],
  exports: [AuthenticatorsService],
})
export class AuthenticatorsModule {}
