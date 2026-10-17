import { Module } from '@nestjs/common';
import { MarketService } from './market.service';
import { MarketController } from './market.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MarketPrice, MarketPriceSchema } from './schema/market-price.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: MarketPrice.name, schema: MarketPriceSchema }])],
  providers: [MarketService],
  controllers: [MarketController]
})
export class MarketModule {}
