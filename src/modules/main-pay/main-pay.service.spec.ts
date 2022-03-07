import { Test, TestingModule } from '@nestjs/testing';
import { MainPayService } from './main-pay.service';

describe('MainPayService', () => {
  let service: MainPayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MainPayService],
    }).compile();

    service = module.get<MainPayService>(MainPayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
