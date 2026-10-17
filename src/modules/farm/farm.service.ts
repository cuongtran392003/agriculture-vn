import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Farm } from "./schema/farm.entity";
import { Model, isValidObjectId } from "mongoose";
import { CreateFarmDto } from "./dto/create-farm.dto";
import { UpdateFarmDto } from "./dto/update-farm.dto";

@Injectable()
export class FarmService {
  constructor(
    @InjectModel(Farm.name) private farmModel: Model<Farm>,
  ) {}

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

  async findOne(id: string, userId: string) {
    if (!isValidObjectId(id)) throw new NotFoundException('Farm not found');
    const farm = await this.farmModel
      .findOne({ _id: id, userId })
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

  async update(id: string, userId: string, updateFarmDto: UpdateFarmDto) {
    if (!isValidObjectId(id)) throw new NotFoundException('Farm not found');
    const farm = await this.farmModel.findOneAndUpdate({ _id: id, userId }, updateFarmDto, {
      new: true,
      runValidators: true,
    });
    if (!farm) {
      throw new NotFoundException(`Farm with id ${id} not found`);
    }
    return {
      message: "Farm updated successfully",
      data: farm,
    };
  }

  async remove(id: string, userId: string) {
    if (!isValidObjectId(id)) throw new NotFoundException('Farm not found');
    const farm = await this.farmModel.findOne({ _id: id, userId });
    if (!farm) throw new NotFoundException(`Farm with id ${id} not found`);
    await farm.deleteOne();
    return {
      message: "Farm deleted successfully",
      data: farm,
    };
  }
}
