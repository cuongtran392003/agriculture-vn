import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CropCareService } from './crop-care.service';
import {
  CreateCarePlanDto,
  CreateCareTemplateDto,
  UpdateCarePlanDto,
} from './crop-care.dto';

@UseGuards(JwtAuthGuard)
@Controller('crop-care')
export class CropCareController {
  constructor(private readonly service: CropCareService) {}
  @Get('templates') templates(@Req() req: any) {
    return this.service.listTemplates(req.user._id);
  }
  @Post('templates') createTemplate(
    @Req() req: any,
    @Body() dto: CreateCareTemplateDto,
  ) {
    return this.service.createTemplate(req.user._id, dto);
  }
  @Get('plans') plans(@Req() req: any) {
    return this.service.listPlans(req.user._id);
  }
  @Post('plans') createPlan(@Req() req: any, @Body() dto: CreateCarePlanDto) {
    return this.service.createPlan(req.user._id, dto);
  }
  @Get('plans/:id') detail(@Req() req: any, @Param('id') id: string) {
    return this.service.detail(id, req.user._id);
  }
  @Patch('plans/:id') update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateCarePlanDto,
  ) {
    return this.service.setActive(id, req.user._id, dto.active);
  }
  @Post('plans/:id/sync') sync(@Req() req: any, @Param('id') id: string) {
    return this.service.sync(id, req.user._id);
  }
}
