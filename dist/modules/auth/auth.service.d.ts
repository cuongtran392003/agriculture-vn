import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { ConfigService } from "@nestjs/config";
export declare class AuthService {
    private userService;
    private jwtService;
    private configService;
    constructor(userService: UsersService, jwtService: JwtService, configService: ConfigService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        data: {
            token: {
                accessToken: string;
                refreshToken: string;
            };
            user: {
                message: string;
                data: import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../users/schema/user.entity").User, {}, import("mongoose").DefaultSchemaOptions> & import("../users/schema/user.entity").User & Required<{
                    _id: import("mongoose").Types.ObjectId;
                }> & {
                    __v: number;
                } & {
                    id: string;
                }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("../users/schema/user.entity").User, {}, import("mongoose").DefaultSchemaOptions> & import("../users/schema/user.entity").User & Required<{
                    _id: import("mongoose").Types.ObjectId;
                }> & {
                    __v: number;
                } & {
                    id: string;
                };
            } | undefined;
        };
    } | undefined>;
    login(loginDto: LoginDto): Promise<{
        message: string;
        data: {
            token: {
                accessToken: string;
                refreshToken: string;
            };
            user: import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../users/schema/user.entity").User, {}, import("mongoose").DefaultSchemaOptions> & import("../users/schema/user.entity").User & Required<{
                _id: import("mongoose").Types.ObjectId;
            }> & {
                __v: number;
            } & {
                id: string;
            }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("../users/schema/user.entity").User, {}, import("mongoose").DefaultSchemaOptions> & import("../users/schema/user.entity").User & Required<{
                _id: import("mongoose").Types.ObjectId;
            }> & {
                __v: number;
            } & {
                id: string;
            };
        };
    }>;
    private generateToken;
    refreshToken(refreshToken: string): Promise<{
        message: string;
        data: {
            token: {
                accessToken: string;
                refreshToken: string;
            };
        };
    }>;
}
