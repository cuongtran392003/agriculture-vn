import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Farm } from "./schema/farm.entity";
import { Model } from "mongoose";
import { CreateFarmDto } from "./dto/create-farm.dto";
import { UpdateFarmDto } from "./dto/update-farm.dto";

@Injectable()
export class FarmService {
  constructor(@InjectModel(Farm.name) private farmModel: Model<Farm>) {}

  async create(createFarmDto: CreateFarmDto) {
    const farm = await this.farmModel.create(createFarmDto);
    return {
      message: "Farm created successfully",
      data: farm,
    };
  }

  async findAll() {
    const farms = await this.farmModel
      .find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });
    return {
      message: "Farms fetched successfully",
      data: farms,
    };
  }

  async findOne(id: string) {
    const farm = await this.farmModel
      .findById(id)
      .populate("userId", "name email");
    if (!farm) {
      throw new NotFoundException(`Farm with id ${id} not found`);
    }
    return {
      message: "Farm fetched successfully",
      data: farm,
    };
  }

  async findByUserId(userId: string) {
    const farms = await this.farmModel
      .find({ userId })
      .sort({ createdAt: -1 });
    return {
      message: "Farms fetched successfully",
      data: farms,
    };
  }

  async update(id: string, updateFarmDto: UpdateFarmDto) {
    const farm = await this.farmModel.findByIdAndUpdate(id, updateFarmDto, {
      new: true,
    });
    if (!farm) {
      throw new NotFoundException(`Farm with id ${id} not found`);
    }
    return {
      message: "Farm updated successfully",
      data: farm,
    };
  }

  async remove(id: string) {
    const farm = await this.farmModel.findByIdAndDelete(id);
    if (!farm) {
      throw new NotFoundException(`Farm with id ${id} not found`);
    }
    return {
      message: "Farm deleted successfully",
      data: farm,
    };
  }
}