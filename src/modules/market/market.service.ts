import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';
import * as cheerio from 'cheerio';

@Injectable()
export class MarketService {
  private readonly logger = new Logger(MarketService.name);

  // Cài đặt cào dữ liệu mỗi ngày vào 7h sáng
  @Cron(CronExpression.EVERY_DAY_AT_7AM)
  async scrapeCoffeePrices() {
    this.logger.log('Bắt đầu cào dữ liệu giá cà phê (Cách 1: Giá trung bình)...');
    
    try {
      const response = await axios.get('https://giacaphe.com/gia-ca-phe-noi-dia/',{
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

      return marketData;
    } catch (error) {
      this.logger.error('Lỗi khi cào dữ liệu giá cà phê', error.message);
    }
  }
}
