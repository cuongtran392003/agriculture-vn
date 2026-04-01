import { PlotService } from "./plot.service";
import { CreatePlotDto } from "./dto/create-plot.dto";
import { UpdatePlotDto } from "./dto/update-plot.dto";
export declare class PlotController {
    private readonly plotService;
    constructor(plotService: PlotService);
    create(createPlotDto: CreatePlotDto): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, import("./schema/plot.schema").Plot, {}, import("mongoose").DefaultSchemaOptions> & import("./schema/plot.schema").Plot & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    findAll(farmId?: string): Promise<{
        message: string;
        data: (import("mongoose").Document<unknown, {}, import("./schema/plot.schema").Plot, {}, import("mongoose").DefaultSchemaOptions> & import("./schema/plot.schema").Plot & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    findOne(id: string): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, import("./schema/plot.schema").Plot, {}, import("mongoose").DefaultSchemaOptions> & import("./schema/plot.schema").Plot & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    update(id: string, updatePlotDto: UpdatePlotDto): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, import("./schema/plot.schema").Plot, {}, import("mongoose").DefaultSchemaOptions> & import("./schema/plot.schema").Plot & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    remove(id: string): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, import("./schema/plot.schema").Plot, {}, import("mongoose").DefaultSchemaOptions> & import("./schema/plot.schema").Plot & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
}
