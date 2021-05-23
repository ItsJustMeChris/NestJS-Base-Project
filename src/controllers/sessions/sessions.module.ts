import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionService } from './session.service';
import { SessionsController } from './sessions.controller';
import { Session } from './sessions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Session])],
  providers: [SessionService],
  controllers: [SessionsController],
  exports: [SessionService],
})
export class SessionsModule {}
