import { HydratedDocument, Types } from "mongoose";
export type FarmDocument = HydratedDocument<Farm>;
export declare class Farm {
    userId?: string;
    name: string;
    description?: string;
    location?: string;
}
export declare const FarmSchema: import("mongoose").Schema<Farm, import("mongoose").Model<Farm, any, any, any, (import("mongoose").Document<unknown, any, Farm, any, import("mongoose").DefaultSchemaOptions> & Farm & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (import("mongoose").Document<unknown, any, Farm, any, import("mongoose").DefaultSchemaOptions> & Farm & {
    _id: Types.ObjectId;
} & {
    __v: number;
}), any, Farm>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Farm, import("mongoose").Document<unknown, {}, Farm, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Farm & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    userId?: import("mongoose").SchemaDefinitionProperty<string | undefined, Farm, import("mongoose").Document<unknown, {}, Farm, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Farm & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    name?: import("mongoose").SchemaDefinitionProperty<string, Farm, import("mongoose").Document<unknown, {}, Farm, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Farm & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string | undefined, Farm, import("mongoose").Document<unknown, {}, Farm, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Farm & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    location?: import("mongoose").SchemaDefinitionProperty<string | undefined, Farm, import("mongoose").Document<unknown, {}, Farm, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Farm & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Farm>;
