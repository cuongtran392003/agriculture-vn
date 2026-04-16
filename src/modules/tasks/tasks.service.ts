import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Task } from "./schema/task.schema";
import { Model } from "mongoose";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { ResponseDto } from "src/common/dto/response.dto";

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  async create(createTaskDto: CreateTaskDto) {
    const task = await this.taskModel.create(createTaskDto);
    return {
      message: "Task created successfully",
      data: task,
    };
  }

  async findAll(userId: string,paginationDto: PaginationDto, farmId?: string, status?:string) {

    const {page = 1, limit =10} = paginationDto
    const skip = (page - 1) * limit


    const query:any ={userId}
    if(farmId) {
      query.farmId = farmId
    }
    if(status) {
      query.status = status
    }

    const [tasks, total] = await Promise.all([
      this.taskModel
      .find(query)
      .populate("farmId", "name")
      .populate("plotId", "name code")
      .sort({ scheduledDate: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
      this.taskModel.countDocuments(query)
    ])
    return new ResponseDto(
      200,
      "Tasks fetched successfully",
      tasks,
      {
        total,
        page,
        limit,
        totalPages:Math.ceil(total/limit),
        hasNextPage:page < Math.ceil(total/limit),
        hasPrevPage: page > 1,
        
      }
    );
  }

  async findOne(id: string) {
    const task = await this.taskModel
      .findById(id)
      .populate("farmId", "name")
      .populate("plotId");
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    return {
      message: "Task fetched successfully",
      data: task,
    };
  }

  async findByUserId(userId: string) {
    const tasks = await this.taskModel
      .find({ userId })
      .populate("farmId", "name")
      .populate("plotId", "name code")
      .sort({ createdAt: -1 });
    return {
      message: "Tasks fetched successfully",
      data: tasks,
    };
  }

  async findByFarmId(farmId: string) {
    const tasks = await this.taskModel
      .find({ farmId })
      .populate("plotId")
      .sort({ scheduledDate: -1 });
    return {
      message: "Tasks fetched successfully",
      data: tasks,
    };
  }

  async findByStatus(status: string) {
    const tasks = await this.taskModel
      .find({ status })
      .populate("farmId", "name")
      .populate("plotId")
      .sort({ scheduledDate: -1 });
    return {
      message: "Tasks fetched successfully",
      data: tasks,
    };
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    // If status is changed to "completed", set completedAt
    if (updateTaskDto.status === "completed") {
      updateTaskDto["completedAt"] = new Date();
    }

    const task = await this.taskModel.findByIdAndUpdate(id, updateTaskDto, {
      new: true,
    });
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    return {
      message: "Task updated successfully",
      data: task,
    };
  }

  async remove(id: string) {
    const task = await this.taskModel.findByIdAndDelete(id);
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    return {
      message: "Task deleted successfully",
      data: task,
    };
  }
}