import { Farm } from "./schema/farm.entity";
import { Model } from "mongoose";
import { CreateFarmDto } from "./dto/create-farm.dto";
import { UpdateFarmDto } from "./dto/update-farm.dto";
export declare class FarmService {
    private farmModel;
    constructor(farmModel: Model<Farm>);
    create(createFarmDto: CreateFarmDto): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, Farm, {}, import("mongoose").DefaultSchemaOptions> & Farm & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    findAll(): Promise<{
        message: string;
        data: (import("mongoose").Document<unknown, {}, Farm, {}, import("mongoose").DefaultSchemaOptions> & Farm & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    findOne(id: string): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, Farm, {}, import("mongoose").DefaultSchemaOptions> & Farm & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    findByUserId(userId: string): Promise<{
        message: string;
        data: (import("mongoose").Document<unknown, {}, Farm, {}, import("mongoose").DefaultSchemaOptions> & Farm & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    update(id: string, updateFarmDto: UpdateFarmDto): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, Farm, {}, import("mongoose").DefaultSchemaOptions> & Farm & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    remove(id: string): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, Farm, {}, import("mongoose").DefaultSchemaOptions> & Farm & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
}
