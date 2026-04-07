import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Plot } from "./schema/plot.schema";
import { Model } from "mongoose";
import { CreatePlotDto } from "./dto/create-plot.dto";
import { UpdatePlotDto } from "./dto/update-plot.dto";

@Injectable()
export class PlotService {
  constructor(@InjectModel(Plot.name) private plotModel: Model<Plot>) {}

  async create(createPlotDto: CreatePlotDto) {
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

  async findOne(id: string) {
    const plot = await this.plotModel
      .findById(id)
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

  async update(id: string, updatePlotDto: UpdatePlotDto) {
    const plot = await this.plotModel.findByIdAndUpdate(id, updatePlotDto, {
      new: true,
    });
    if (!plot) {
      throw new NotFoundException(`Plot with id ${id} not found`);
    }
    return {
      message: "Plot updated successfully",
      data: plot,
    };
  }

  async remove(id: string) {
    const plot = await this.plotModel.findByIdAndDelete(id);
    if (!plot) {
      throw new NotFoundException(`Plot with id ${id} not found`);
    }
    return {
      message: "Plot deleted successfully",
      data: plot,
    };
  }
}