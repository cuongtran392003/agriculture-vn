import { TasksService } from "./tasks.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
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
    findAll(req: any, farmId?: string, status?: string): Promise<{
        message: string;
        data: (import("mongoose").Document<unknown, {}, import("./schema/task.schema").Task, {}, import("mongoose").DefaultSchemaOptions> & import("./schema/task.schema").Task & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
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
