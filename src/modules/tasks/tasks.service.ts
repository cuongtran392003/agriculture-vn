import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Task } from "./schema/task.schema";
import { Model, isValidObjectId } from "mongoose";
import { Farm } from '../farm/schema/farm.entity';
import { Plot } from '../plot/schema/plot.schema';
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { PaginationDto } from "../../common/dto/pagination.dto";
import { ResponseDto } from "../../common/dto/response.dto";

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,
    @InjectModel(Farm.name) private farmModel: Model<Farm>,
    @InjectModel(Plot.name) private plotModel: Model<Plot>,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    if (!isValidObjectId(createTaskDto.farmId) || !(await this.farmModel.exists({ _id: createTaskDto.farmId, userId: createTaskDto.userId }))) {
      throw new ForbiddenException('Farm does not belong to the current user');
    }
    if (createTaskDto.plotId && (!isValidObjectId(createTaskDto.plotId) || !(await this.plotModel.exists({ _id: createTaskDto.plotId, farmId: createTaskDto.farmId, userId: createTaskDto.userId })))) {
      throw new ForbiddenException('Plot does not belong to the selected farm');
    }

    try {
    const { scheduledDate, scheduledTime } = createTaskDto;
    
      console.log('Dữ liệu nhận được:', { scheduledDate, scheduledTime });

      const reminderAt = this.buildReminderAt(scheduledDate, scheduledTime);

    if (isNaN(reminderAt.getTime())) {
       throw new BadRequestException('Invalid scheduled date or time');
    }

    const task = await this.taskModel.create({
      ...createTaskDto,
      reminderAt,
      isNotified: false,
      ...(createTaskDto.status === 'completed' && { completedAt: new Date() }),
    });

    return { message: "Task created successfully", data: task };
  } catch (error) {
    console.error('Lỗi chi tiết tại Service:', error.message);
    throw error; // Ném lỗi để Exception Filter xử lý
  }
  }

  private buildReminderAt(scheduledDate: string, scheduledTime?: string): Date {
    const dateHasTime = scheduledDate.includes('T');
    const calendarDate = dateHasTime ? scheduledDate.slice(0, 10) : scheduledDate;
    const reminderValue = scheduledTime?.includes('T')
      ? scheduledTime
      : dateHasTime && !scheduledTime
        ? scheduledDate
        : `${calendarDate}T${scheduledTime ?? '00:00'}:00+07:00`;
    const reminderAt = new Date(reminderValue);
    if (Number.isNaN(reminderAt.getTime())) throw new BadRequestException('Invalid scheduled date or time');
    return reminderAt;
  }

  async findAll(userId: string,paginationDto: PaginationDto, farmId?: string, status?:string) {

    const {page = 1, limit =10} = paginationDto
    const skip = (page - 1) * limit


    if (farmId && !isValidObjectId(farmId)) throw new BadRequestException('Invalid farmId');
    if (status && !['pending', 'completed', 'cancelled'].includes(status)) throw new BadRequestException('Invalid task status');
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

  async findOne(id: string, userId: string) {
    if (!isValidObjectId(id)) throw new NotFoundException('Task not found');
    const task = await this.taskModel
      .findOne({ _id: id, userId })
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

  async update(id: string, userId: string, updateTaskDto: UpdateTaskDto) {
    if (!isValidObjectId(id)) throw new NotFoundException('Task not found');
    const current = await this.taskModel.findOne({ _id: id, userId });
    if (!current) throw new NotFoundException(`Task with id ${id} not found`);

    const changes: Record<string, unknown> = { ...updateTaskDto };
    if (updateTaskDto.plotId && (!isValidObjectId(updateTaskDto.plotId) || !(await this.plotModel.exists({
      _id: updateTaskDto.plotId,
      farmId: current.farmId,
      userId,
    })))) {
      throw new ForbiddenException('Plot does not belong to this task farm');
    }
    if (updateTaskDto.scheduledDate !== undefined || updateTaskDto.scheduledTime !== undefined) {
      changes.reminderAt = this.buildReminderAt(
        updateTaskDto.scheduledDate ?? current.scheduledDate,
        updateTaskDto.scheduledTime ?? current.scheduledTime,
      );
      changes.isNotified = false;
    }
    if (updateTaskDto.status === 'completed') {
      changes.completedAt = current.completedAt ?? new Date();
    } else if (updateTaskDto.status !== undefined) {
      delete changes.completedAt;
      if (updateTaskDto.status === 'pending') changes.isNotified = false;
    }

    const update: Record<string, unknown> = { $set: changes };
    const unset: Record<string, 1> = {};
    if (current.carePlanId && (updateTaskDto.scheduledDate !== undefined || updateTaskDto.scheduledTime !== undefined)) {
      // A farmer's explicit schedule takes precedence over weather automation.
      changes.weatherBlocked = false;
      unset.careAction = 1;
      unset.careBaseTime = 1;
      unset.weatherNote = 1;
    }
    if (updateTaskDto.status && updateTaskDto.status !== 'completed') {
      unset.completedAt = 1;
    }
    if (updateTaskDto.status !== undefined || updateTaskDto.scheduledDate !== undefined || updateTaskDto.scheduledTime !== undefined) {
      unset.reminderClaimedAt = 1;
    }
    if (Object.keys(unset).length) update.$unset = unset;
    const task = await this.taskModel.findOneAndUpdate({ _id: id, userId }, update, {
      new: true,
      runValidators: true,
    });
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    return {
      message: "Task updated successfully",
      data: task,
    };
  }

  async remove(id: string, userId: string) {
    if (!isValidObjectId(id)) throw new NotFoundException('Task not found');
    const task = await this.taskModel.findOneAndDelete({ _id: id, userId });
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    return {
      message: "Task deleted successfully",
      data: task,
    };
  }
}
