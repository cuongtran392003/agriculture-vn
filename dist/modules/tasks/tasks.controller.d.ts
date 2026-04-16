import { TasksService } from "./tasks.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { PaginationDto } from "src/common/dto/pagination.dto";
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    create(req: any, createTaskDto: CreateTaskDto): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, import("./schema/task.schema").Task, {}, import("mongoose").DefaultSchemaOptions> & import("./schema/task.schema").Task & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    findAll(req: any, paginationDto: PaginationDto, farmId?: string, status?: string): Promise<import("../../common/dto/response.dto").ResponseDto<(import("./schema/task.schema").Task & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>>;
    findOne(id: string): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, import("./schema/task.schema").Task, {}, import("mongoose").DefaultSchemaOptions> & import("./schema/task.schema").Task & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    update(id: string, updateTaskDto: UpdateTaskDto): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, import("./schema/task.schema").Task, {}, import("mongoose").DefaultSchemaOptions> & import("./schema/task.schema").Task & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    remove(id: string): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, import("./schema/task.schema").Task, {}, import("mongoose").DefaultSchemaOptions> & import("./schema/task.schema").Task & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
}
