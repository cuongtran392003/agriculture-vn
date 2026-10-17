import { Controller, Get, UseGuards } from '@nestjs/common';
import { MarketService } from './market.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('market')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Get('coffee/sync')
  @UseGuards(JwtAuthGuard)
  async triggerScrape() {
    // Gọi API này để test cào dữ liệu bằng tay lập tức (thay vì chờ đến 7h sáng)
    const result = await this.marketService.scrapeCoffeePrices();
    return {
      success: true,
      message: 'Cào dữ liệu giá cà phê thành công',
      data: result
    };
  }

  @Get('coffee/latest')
  getLatestCoffeePrice() {
    return this.marketService.getLatestCoffeePrice();
  }
  // (Sau này bạn thêm API Get Market Prices lấy từ MongoDB ra cho App Mobile nhé)
}
