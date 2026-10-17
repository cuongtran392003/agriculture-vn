import { Plot } from "./schema/plot.schema";
import { Model } from "mongoose";
import { Farm } from '../farm/schema/farm.entity';
import { CreatePlotDto } from "./dto/create-plot.dto";
import { UpdatePlotDto } from "./dto/update-plot.dto";
export declare class PlotService {
    private plotModel;
    private farmModel;
    constructor(plotModel: Model<Plot>, farmModel: Model<Farm>);
    create(createPlotDto: CreatePlotDto): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, Plot, {}, import("mongoose").DefaultSchemaOptions> & Plot & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    findAll(): Promise<{
        message: string;
        data: (import("mongoose").Document<unknown, {}, Plot, {}, import("mongoose").DefaultSchemaOptions> & Plot & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    findOne(id: string, userId: string): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, Plot, {}, import("mongoose").DefaultSchemaOptions> & Plot & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    findByFarmAndUserId(farmId: string, userId: string): Promise<{
        message: string;
        data: (import("mongoose").Document<unknown, {}, Plot, {}, import("mongoose").DefaultSchemaOptions> & Plot & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    findByUserId(userId: string): Promise<{
        message: string;
        data: (import("mongoose").Document<unknown, {}, Plot, {}, import("mongoose").DefaultSchemaOptions> & Plot & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    update(id: string, userId: string, updatePlotDto: UpdatePlotDto): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, Plot, {}, import("mongoose").DefaultSchemaOptions> & Plot & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    remove(id: string, userId: string): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, Plot, {}, import("mongoose").DefaultSchemaOptions> & Plot & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
}
