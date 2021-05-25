import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokensService } from './services/refresh-tokens.service';
import { RefreshToken } from './models/refresh-tokens.entity';
import { RefreshTokensController } from './controllers/refresh-tokens.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RefreshToken])],
  providers: [RefreshTokensService],
  controllers: [RefreshTokensController],
  exports: [RefreshTokensService],
})
export class RefreshTokensModule {}
