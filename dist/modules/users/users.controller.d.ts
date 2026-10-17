import { UsersService } from './users.service';
declare class UpdateOwnProfileDto {
    name?: string;
    email?: string;
}
declare class UpdateFcmTokenDto {
    token: string;
}
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findOne(id: string, req: any): import("mongoose").Query<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schema/user.entity").User, {}, import("mongoose").DefaultSchemaOptions> & import("./schema/user.entity").User & Required<{
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
    updateFcmToken(req: any, body: UpdateFcmTokenDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schema/user.entity").User, {}, import("mongoose").DefaultSchemaOptions> & import("./schema/user.entity").User & Required<{
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
    update(id: string, req: any, updateUserDto: UpdateOwnProfileDto): Promise<{
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
    }>;
    remove(id: string, req: any): Promise<{
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
    }>;
}
export {};
