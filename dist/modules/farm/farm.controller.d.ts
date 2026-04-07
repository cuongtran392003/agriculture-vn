import { FarmService } from "./farm.service";
import { CreateFarmDto } from "./dto/create-farm.dto";
import { UpdateFarmDto } from "./dto/update-farm.dto";
export declare class FarmController {
    private readonly farmService;
    constructor(farmService: FarmService);
    create(req: any, createFarmDto: CreateFarmDto): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, import("./schema/farm.entity").Farm, {}, import("mongoose").DefaultSchemaOptions> & import("./schema/farm.entity").Farm & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    findAll(req: any): Promise<{
        message: string;
        data: (import("mongoose").Document<unknown, {}, import("./schema/farm.entity").Farm, {}, import("mongoose").DefaultSchemaOptions> & import("./schema/farm.entity").Farm & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    findOne(id: string): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, import("./schema/farm.entity").Farm, {}, import("mongoose").DefaultSchemaOptions> & import("./schema/farm.entity").Farm & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    update(id: string, updateFarmDto: UpdateFarmDto): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, import("./schema/farm.entity").Farm, {}, import("mongoose").DefaultSchemaOptions> & import("./schema/farm.entity").Farm & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    remove(id: string): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, import("./schema/farm.entity").Farm, {}, import("mongoose").DefaultSchemaOptions> & import("./schema/farm.entity").Farm & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
}
