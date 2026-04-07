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
import { FarmService } from "./farm.service";
import { CreateFarmDto } from "./dto/create-farm.dto";
import { UpdateFarmDto } from "./dto/update-farm.dto";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
@Controller("farm")
export class FarmController {
  constructor(private readonly farmService: FarmService) {}

  
  @Post()
  async create( @Req() req:any ,@Body() createFarmDto: CreateFarmDto) {
    createFarmDto.userId = req.user._id;
    return await this.farmService.create(createFarmDto);
  }

  @Get()
  async findAll(@Req() req:any) {
    const userId = req.user._id;
    if (userId) {
      return await this.farmService.findByUserId(userId);
    }
    return await this.farmService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return await this.farmService.findOne(id);
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateFarmDto: UpdateFarmDto,
  ) {
    return await this.farmService.update(id, updateFarmDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return await this.farmService.remove(id);
  }
}