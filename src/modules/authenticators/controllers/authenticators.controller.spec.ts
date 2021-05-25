import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticatorsController } from './authenticators.controller';

describe('AuthenticatorsController', () => {
  let controller: AuthenticatorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticatorsController],
    }).compile();

    controller = module.get<AuthenticatorsController>(AuthenticatorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
