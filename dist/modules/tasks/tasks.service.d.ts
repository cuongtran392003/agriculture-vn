import { Task } from "./schema/task.schema";
import { Model } from "mongoose";
import { Farm } from '../farm/schema/farm.entity';
import { Plot } from '../plot/schema/plot.schema';
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { PaginationDto } from "../../common/dto/pagination.dto";
import { ResponseDto } from "../../common/dto/response.dto";
export declare class TasksService {
    private taskModel;
    private farmModel;
    private plotModel;
    constructor(taskModel: Model<Task>, farmModel: Model<Farm>, plotModel: Model<Plot>);
    create(createTaskDto: CreateTaskDto): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, Task, {}, import("mongoose").DefaultSchemaOptions> & Task & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    private buildReminderAt;
    findAll(userId: string, paginationDto: PaginationDto, farmId?: string, status?: string): Promise<ResponseDto<(Task & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>>;
    findOne(id: string, userId: string): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, Task, {}, import("mongoose").DefaultSchemaOptions> & Task & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    findByUserId(userId: string): Promise<{
        message: string;
        data: (import("mongoose").Document<unknown, {}, Task, {}, import("mongoose").DefaultSchemaOptions> & Task & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    findByFarmId(farmId: string): Promise<{
        message: string;
        data: (import("mongoose").Document<unknown, {}, Task, {}, import("mongoose").DefaultSchemaOptions> & Task & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    findByStatus(status: string): Promise<{
        message: string;
        data: (import("mongoose").Document<unknown, {}, Task, {}, import("mongoose").DefaultSchemaOptions> & Task & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    update(id: string, userId: string, updateTaskDto: UpdateTaskDto): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, Task, {}, import("mongoose").DefaultSchemaOptions> & Task & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    remove(id: string, userId: string): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, Task, {}, import("mongoose").DefaultSchemaOptions> & Task & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
}
