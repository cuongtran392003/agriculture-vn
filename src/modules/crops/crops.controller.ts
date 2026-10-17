import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateCropDto, ListCropsDto, UpdateCropDto } from './crop.dto';
import { CropsService } from './crops.service';

@UseGuards(JwtAuthGuard)
@Controller('crops')
export class CropsController {
  constructor(private readonly service: CropsService) {}
  @Post() create(@Req() req: any, @Body() dto: CreateCropDto) {
    return this.service.create(req.user._id, dto);
  }
  @Get() findAll(@Req() req: any, @Query() dto: ListCropsDto) {
    return this.service.findAll(req.user._id, dto);
  }
  @Get(':id') findOne(@Req() req: any, @Param('id') id: string) {
    return this.service.findOne(id, req.user._id);
  }
  @Patch(':id') update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateCropDto,
  ) {
    return this.service.update(id, req.user._id, dto);
  }
  @Delete(':id') remove(@Req() req: any, @Param('id') id: string) {
    return this.service.remove(id, req.user._id);
  }
}
