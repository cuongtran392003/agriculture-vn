import { HydratedDocument, Types } from "mongoose";
export type TaskDocument = HydratedDocument<Task>;
export declare class Task {
    carePlanId?: Types.ObjectId;
    careKey?: string;
    careAction?: string;
    growthStage?: string;
    careBaseTime?: string;
    careRainThresholdMm?: number;
    careHeatThresholdC?: number;
    weatherBlocked?: boolean;
    carePaused?: boolean;
    weatherNote?: string;
    userId: Types.ObjectId;
    farmId: Types.ObjectId;
    plotId?: Types.ObjectId;
    title: string;
    description?: string;
    cropName?: string;
    scheduledDate: string;
    scheduledTime?: string;
    status: string;
    priority: string;
    note?: string;
    completedAt?: Date;
    reminderAt?: Date;
    isNotified: boolean;
    reminderClaimedAt?: Date;
}
export declare const TaskSchema: import("mongoose").Schema<Task, import("mongoose").Model<Task, any, any, any, (import("mongoose").Document<unknown, any, Task, any, import("mongoose").DefaultSchemaOptions> & Task & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (import("mongoose").Document<unknown, any, Task, any, import("mongoose").DefaultSchemaOptions> & Task & {
    _id: Types.ObjectId;
} & {
    __v: number;
}), any, Task>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Task, import("mongoose").Document<unknown, {}, Task, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Task & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    carePlanId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, Task, import("mongoose").Document<unknown, {}, Task, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Task & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    careKey?: import("mongoose").SchemaDefinitionProperty<string | undefined, Task, import("mongoose").Document<unknown, {}, Task, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Task & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    careAction?: import("mongoose").SchemaDefinitionProperty<string | undefined, Task, import("mongoose").Document<unknown, {}, Task, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Task & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    growthStage?: import("mongoose").SchemaDefinitionProperty<string | undefined, Task, import("mongoose").Document<unknown, {}, Task, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Task & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    careBaseTime?: import("mongoose").SchemaDefinitionProperty<string | undefined, Task, import("mongoose").Document<unknown, {}, Task, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Task & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    careRainThresholdMm?: import("mongoose").SchemaDefinitionProperty<number | undefined, Task, import("mongoose").Document<unknown, {}, Task, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Task & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    careHeatThresholdC?: import("mongoose").SchemaDefinitionProperty<number | undefined, Task, import("mongoose").Document<unknown, {}, Task, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Task & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    weatherBlocked?: import("mongoose").SchemaDefinitionProperty<boolean | undefined, Task, import("mongoose").Document<unknown, {}, Task, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Task & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    carePaused?: import("mongoose").SchemaDefinitionProperty<boolean | undefined, Task, import("mongoose").Document<unknown, {}, Task, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Task & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    weatherNote?: import("mongoose").SchemaDefinitionProperty<string | undefined, Task, import("mongoose").Document<unknown, {}, Task, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Task & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    userId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Task, import("mongoose").Document<unknown, {}, Task, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Task & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    farmId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Task, import("mongoose").Document<unknown, {}, Task, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Task & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    plotId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, Task, import("mongoose").Document<unknown, {}, Task, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Task & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    title?: import("mongoose").SchemaDefinitionProperty<string, Task, import("mongoose").Document<unknown, {}, Task, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Task & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string | undefined, Task, import("mongoose").Document<unknown, {}, Task, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Task & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    cropName?: import("mongoose").SchemaDefinitionProperty<string | undefined, Task, import("mongoose").Document<unknown, {}, Task, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Task & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    scheduledDate?: import("mongoose").SchemaDefinitionProperty<string, Task, import("mongoose").Document<unknown, {}, Task, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Task & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    scheduledTime?: import("mongoose").SchemaDefinitionProperty<string | undefined, Task, import("mongoose").Document<unknown, {}, Task, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Task & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<string, Task, import("mongoose").Document<unknown, {}, Task, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Task & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    priority?: import("mongoose").SchemaDefinitionProperty<string, Task, import("mongoose").Document<unknown, {}, Task, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Task & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    note?: import("mongoose").SchemaDefinitionProperty<string | undefined, Task, import("mongoose").Document<unknown, {}, Task, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Task & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    completedAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, Task, import("mongoose").Document<unknown, {}, Task, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Task & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    reminderAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, Task, import("mongoose").Document<unknown, {}, Task, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Task & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isNotified?: import("mongoose").SchemaDefinitionProperty<boolean, Task, import("mongoose").Document<unknown, {}, Task, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Task & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    reminderClaimedAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, Task, import("mongoose").Document<unknown, {}, Task, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Task & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Task>;
