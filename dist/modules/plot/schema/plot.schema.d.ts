import { HydratedDocument, Types } from "mongoose";
export type PlotDocument = HydratedDocument<Plot>;
export declare class Plot {
    farmId: Types.ObjectId;
    name: string;
    code?: string;
    description?: string;
}
export declare const PlotSchema: import("mongoose").Schema<Plot, import("mongoose").Model<Plot, any, any, any, (import("mongoose").Document<unknown, any, Plot, any, import("mongoose").DefaultSchemaOptions> & Plot & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (import("mongoose").Document<unknown, any, Plot, any, import("mongoose").DefaultSchemaOptions> & Plot & {
    _id: Types.ObjectId;
} & {
    __v: number;
}), any, Plot>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Plot, import("mongoose").Document<unknown, {}, Plot, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Plot & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    farmId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Plot, import("mongoose").Document<unknown, {}, Plot, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Plot & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    name?: import("mongoose").SchemaDefinitionProperty<string, Plot, import("mongoose").Document<unknown, {}, Plot, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Plot & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    code?: import("mongoose").SchemaDefinitionProperty<string | undefined, Plot, import("mongoose").Document<unknown, {}, Plot, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Plot & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string | undefined, Plot, import("mongoose").Document<unknown, {}, Plot, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Plot & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Plot>;
