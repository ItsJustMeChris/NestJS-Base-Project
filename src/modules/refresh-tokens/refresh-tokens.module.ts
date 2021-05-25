import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokensService } from './refresh-tokens.service';
import { RefreshTokensController } from './refresh-tokens.controller';
import { RefreshToken } from './refresh-tokens.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RefreshToken])],
  providers: [RefreshTokensService],
  controllers: [RefreshTokensController],
  exports: [RefreshTokensService],
})
export class RefreshTokensModule {}
