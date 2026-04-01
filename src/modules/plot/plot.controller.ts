import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { PlotService } from "./plot.service";
import { CreatePlotDto } from "./dto/create-plot.dto";
import { UpdatePlotDto } from "./dto/update-plot.dto";

@Controller("plot")
export class PlotController {
  constructor(private readonly plotService: PlotService) {}

  @Post()
  async create(@Body() createPlotDto: CreatePlotDto) {
    return await this.plotService.create(createPlotDto);
  }

  @Get()
  async findAll(@Query("farmId") farmId?: string) {
    if (farmId) {
      return await this.plotService.findByFarmId(farmId);
    }
    return await this.plotService.findAll();
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