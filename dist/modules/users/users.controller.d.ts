import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schema/user.entity").User, {}, import("mongoose").DefaultSchemaOptions> & import("./schema/user.entity").User & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schema/user.entity").User, {}, import("mongoose").DefaultSchemaOptions> & import("./schema/user.entity").User & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    } | undefined>;
    findAll(): {
        message: string;
        data: import("mongoose").Query<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schema/user.entity").User, {}, import("mongoose").DefaultSchemaOptions> & import("./schema/user.entity").User & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schema/user.entity").User, {}, import("mongoose").DefaultSchemaOptions> & import("./schema/user.entity").User & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[], import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schema/user.entity").User, {}, import("mongoose").DefaultSchemaOptions> & import("./schema/user.entity").User & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schema/user.entity").User, {}, import("mongoose").DefaultSchemaOptions> & import("./schema/user.entity").User & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").Document<unknown, {}, import("./schema/user.entity").User, {}, import("mongoose").DefaultSchemaOptions> & import("./schema/user.entity").User & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        }, "find", {}>;
    };
    findOne(id: string): import("mongoose").Query<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schema/user.entity").User, {}, import("mongoose").DefaultSchemaOptions> & import("./schema/user.entity").User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schema/user.entity").User, {}, import("mongoose").DefaultSchemaOptions> & import("./schema/user.entity").User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null, import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schema/user.entity").User, {}, import("mongoose").DefaultSchemaOptions> & import("./schema/user.entity").User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schema/user.entity").User, {}, import("mongoose").DefaultSchemaOptions> & import("./schema/user.entity").User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").Document<unknown, {}, import("./schema/user.entity").User, {}, import("mongoose").DefaultSchemaOptions> & import("./schema/user.entity").User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, "findOne", {}>;
    updateFcmToken(req: any, fcmToken: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schema/user.entity").User, {}, import("mongoose").DefaultSchemaOptions> & import("./schema/user.entity").User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schema/user.entity").User, {}, import("mongoose").DefaultSchemaOptions> & import("./schema/user.entity").User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
        message: string;
        data: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schema/user.entity").User, {}, import("mongoose").DefaultSchemaOptions> & import("./schema/user.entity").User & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schema/user.entity").User, {}, import("mongoose").DefaultSchemaOptions> & import("./schema/user.entity").User & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        }) | null;
    } | undefined>;
    remove(id: string): import("mongoose").Query<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schema/user.entity").User, {}, import("mongoose").DefaultSchemaOptions> & import("./schema/user.entity").User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schema/user.entity").User, {}, import("mongoose").DefaultSchemaOptions> & import("./schema/user.entity").User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null, import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schema/user.entity").User, {}, import("mongoose").DefaultSchemaOptions> & import("./schema/user.entity").User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schema/user.entity").User, {}, import("mongoose").DefaultSchemaOptions> & import("./schema/user.entity").User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").Document<unknown, {}, import("./schema/user.entity").User, {}, import("mongoose").DefaultSchemaOptions> & import("./schema/user.entity").User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, "findOneAndDelete", {}>;
}
