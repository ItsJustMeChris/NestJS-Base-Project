import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticatorsService } from './authenticators.service';

describe('AuthenticatorsService', () => {
  let service: AuthenticatorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthenticatorsService],
    }).compile();

    service = module.get<AuthenticatorsService>(AuthenticatorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
