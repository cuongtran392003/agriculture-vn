import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Plot } from "./schema/plot.schema";
import { Model, isValidObjectId } from "mongoose";
import { Farm } from '../farm/schema/farm.entity';
import { ForbiddenException } from '@nestjs/common';
import { CreatePlotDto } from "./dto/create-plot.dto";
import { UpdatePlotDto } from "./dto/update-plot.dto";

@Injectable()
export class PlotService {
  constructor(
    @InjectModel(Plot.name) private plotModel: Model<Plot>,
    @InjectModel(Farm.name) private farmModel: Model<Farm>,
  ) {}

  async create(createPlotDto: CreatePlotDto) {
    if (!isValidObjectId(createPlotDto.farmId) || !(await this.farmModel.exists({ _id: createPlotDto.farmId, userId: createPlotDto.userId }))) {
      throw new ForbiddenException('Farm does not belong to the current user');
    }
    const plot = await this.plotModel.create(createPlotDto);
    return {
      message: "Plot created successfully",
      data: plot,
    };
  }

  async findAll() {
    const plots = await this.plotModel
      .find()
      .populate("farmId", "name")
      .sort({ createdAt: -1 });
    return {
      message: "Plots fetched successfully",
      data: plots,
    };
  }

  async findOne(id: string, userId: string) {
    if (!isValidObjectId(id)) throw new NotFoundException('Plot not found');
    const plot = await this.plotModel
      .findOne({ _id: id, userId })
      .populate("farmId", "name");
    if (!plot) {
      throw new NotFoundException(`Plot with id ${id} not found`);
    }
    return {
      message: "Plot fetched successfully",
      data: plot,
    };
  }

  async findByFarmAndUserId(farmId: string, userId: string) {
    const plots = await this.plotModel
      .find({ farmId, userId })
      .populate("farmId", "name")
      .sort({ createdAt: -1 });
    return {
      message: "Plots fetched successfully",
      data: plots,
    };
  }

  async findByUserId(userId: string){
    const plots = await this.plotModel.find({userId}).sort({createdAt: -1})
    return {
      message: "Plots fetched successfully",
      data: plots,
    };
  }

  async update(id: string, userId: string, updatePlotDto: UpdatePlotDto) {
    if (!isValidObjectId(id)) throw new NotFoundException('Plot not found');
    const plot = await this.plotModel.findOneAndUpdate({ _id: id, userId }, updatePlotDto, {
      new: true,
      runValidators: true,
    });
    if (!plot) {
      throw new NotFoundException(`Plot with id ${id} not found`);
    }
    return {
      message: "Plot updated successfully",
      data: plot,
    };
  }

  async remove(id: string, userId: string) {
    if (!isValidObjectId(id)) throw new NotFoundException('Plot not found');
    const plot = await this.plotModel.findOneAndDelete({ _id: id, userId });
    if (!plot) {
      throw new NotFoundException(`Plot with id ${id} not found`);
    }
    return {
      message: "Plot deleted successfully",
      data: plot,
    };
  }
}
