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
} from "@nestjs/common";
import { PlotService } from "./plot.service";
import { CreatePlotDto } from "./dto/create-plot.dto";
import { UpdatePlotDto } from "./dto/update-plot.dto";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
@Controller("plot")
export class PlotController {
  constructor(private readonly plotService: PlotService) {}

  @Post()
  async create(@Req() req:any,@Body() createPlotDto: CreatePlotDto) {
    createPlotDto.userId = req.user._id
    return await this.plotService.create(createPlotDto);
  }

  @Get()
  async findAll(@Req() req:any,@Query("farmId") farmId?: string) {
    const userId = req.user._id
    if (farmId) {
      return await this.plotService.findByFarmAndUserId(farmId, userId);
    }
    return await this.plotService.findByUserId(userId);
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return await this.plotService.findOne(id);
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updatePlotDto: UpdatePlotDto,
  ) {
    return await this.plotService.update(id, updatePlotDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return await this.plotService.remove(id);
  }
}