import { Test, TestingModule } from '@nestjs/testing';
import { MarketService } from './market.service';
import { getModelToken } from '@nestjs/mongoose';
import { MarketPrice } from './schema/market-price.schema';

describe('MarketService', () => {
  let service: MarketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MarketService, { provide: getModelToken(MarketPrice.name), useValue: {} }],
    }).compile();

    service = module.get<MarketService>(MarketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
