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
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { PaginationDto } from "../../common/dto/pagination.dto";

@UseGuards(JwtAuthGuard)
@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(@Req() req:any,@Body() createTaskDto: CreateTaskDto) {
    createTaskDto.userId = req.user._id;
    return await this.tasksService.create(createTaskDto);
  }

  @Get()
  async findAll(
    @Req() req:any,
    @Query() paginationDto: PaginationDto,
    @Query("farmId") farmId?: string,
    @Query("status") status?: string,
  ) {
    const userId = req.user._id
    return await this.tasksService.findAll(userId,paginationDto,farmId,status);
  }

  @Get(":id")
  async findOne(@Param("id") id: string, @Req() req: any) {
    return await this.tasksService.findOne(id, req.user._id);
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Req() req: any,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return await this.tasksService.update(id, req.user._id, updateTaskDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string, @Req() req: any) {
    return await this.tasksService.remove(id, req.user._id);
  }
}
