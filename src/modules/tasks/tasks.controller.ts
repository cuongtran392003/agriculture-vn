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
import { TasksService } from "./tasks.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";

@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto) {
    return await this.tasksService.create(createTaskDto);
  }

  @Get()
  async findAll(
    @Query("farmId") farmId?: string,
    @Query("status") status?: string,
  ) {
    if (farmId) {
      return await this.tasksService.findByFarmId(farmId);
    }
    if (status) {
      return await this.tasksService.findByStatus(status);
    }
    return await this.tasksService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return await this.tasksService.findOne(id);
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return await this.tasksService.update(id, updateTaskDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return await this.tasksService.remove(id);
  }
}