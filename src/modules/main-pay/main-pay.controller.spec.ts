import { Test, TestingModule } from '@nestjs/testing';
import { MainPayController } from './main-pay.controller';
import { MainPayService } from './main-pay.service';

describe('MainPayController', () => {
  let controller: MainPayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MainPayController],
      providers: [MainPayService],
    }).compile();

    controller = module.get<MainPayController>(MainPayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
