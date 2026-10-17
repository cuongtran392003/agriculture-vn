import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { InjectModel } from '@nestjs/mongoose';
import { MarketPrice, MarketPriceDocument } from './schema/market-price.schema';
import { Model } from 'mongoose';

@Injectable()
export class MarketService {
  private readonly logger = new Logger(MarketService.name);

  constructor(@InjectModel(MarketPrice.name) private readonly marketPriceModel: Model<MarketPriceDocument>) {}

  // Cài đặt cào dữ liệu mỗi ngày vào 7h sáng
  @Cron(CronExpression.EVERY_DAY_AT_7AM)
  async scrapeCoffeePrices() {
    this.logger.log('Bắt đầu cào dữ liệu giá cà phê (Cách 1: Giá trung bình)...');
    
    try {
      const response = await axios.get('https://giacaphe.com/gia-ca-phe-noi-dia/',{
         timeout: 10000,
         headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
          'Connection': 'keep-alive',
        }
      });
      const html = response.data;
      const $ = cheerio.load(html);

      // Tìm thẻ <p> đầu tiên nằm trong class .content-min-h
      const summaryParagraph = $('.content-min-h p').eq(0);
      
      // Lấy chữ "88,700 đ/kg" (thẻ strong thứ 2)
      const averagePriceText = summaryParagraph.find('strong').eq(1).text().trim();
      
      // Lấy phần thay đổi giá "+1,700"
      const priceChangeText = summaryParagraph.find('.price_change').text().trim();

      // Bóc tách thành số nguyên để lưu vào Database
      const priceNumber = parseInt(averagePriceText.replace(/,/g, '').replace(' đ/kg', ''), 10);
      const changeNumber = parseInt(priceChangeText.replace(/,/g, '').replace('+', ''), 10);
      if (!Number.isFinite(priceNumber) || priceNumber <= 0 || !Number.isFinite(changeNumber)) {
        throw new Error('Coffee price page did not contain valid price data');
      }

      const marketData = {
        name: 'Cà phê nội địa (Trung bình)',
        price: priceNumber, // 88700
        change: changeNumber > 0 ? `+${changeNumber}` : `${changeNumber}`, // "+1700"
        updatedAt: new Date(),
      };

      this.logger.log('Dữ liệu đã cào thành công:');
      console.log(marketData);

      // TODO: Ở đây bạn sẽ dùng Mongoose để lưu vào Database
      // await this.marketModel.create(marketData);

      await this.marketPriceModel.findOneAndUpdate(
        { name: marketData.name },
        marketData,
        { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
      );
      return marketData;
    } catch (error) {
      this.logger.error('Coffee price scrape failed', error?.stack);
      throw new ServiceUnavailableException('Coffee market data is temporarily unavailable');
    }
  }

  async getLatestCoffeePrice() {
    const price = await this.marketPriceModel.findOne({ name: 'Cà phê nội địa (Trung bình)' }).lean();
    return { message: 'Latest coffee price fetched successfully', data: price };
  }
}
