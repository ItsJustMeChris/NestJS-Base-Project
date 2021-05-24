import { Test, TestingModule } from '@nestjs/testing';
import { RefreshTokensController } from './refresh-tokens.controller';

describe('RefreshTokensController', () => {
  let controller: RefreshTokensController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RefreshTokensController],
    }).compile();

    controller = module.get<RefreshTokensController>(RefreshTokensController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
