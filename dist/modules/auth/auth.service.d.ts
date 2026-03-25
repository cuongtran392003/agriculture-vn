import { JwtService } from "@nestjs/jwt";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { ConfigService } from "@nestjs/config";
import { User, UserDocument } from "../users/schema/user.entity";
import { Model } from "mongoose";
export declare class AuthService {
    private jwtService;
    private configService;
    private userModel;
    constructor(jwtService: JwtService, configService: ConfigService, userModel: Model<UserDocument>);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        data: {
            token: {
                accessToken: string;
                refreshToken: string;
            };
            user: import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, User, {}, import("mongoose").DefaultSchemaOptions> & User & Required<{
                _id: import("mongoose").Types.ObjectId;
            }> & {
                __v: number;
            } & {
                id: string;
            }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, User, {}, import("mongoose").DefaultSchemaOptions> & User & Required<{
                _id: import("mongoose").Types.ObjectId;
            }> & {
                __v: number;
            } & {
                id: string;
            };
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        message: string;
        data: {
            token: {
                accessToken: string;
                refreshToken: string;
            };
            user: import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, User, {}, import("mongoose").DefaultSchemaOptions> & User & Required<{
                _id: import("mongoose").Types.ObjectId;
            }> & {
                __v: number;
            } & {
                id: string;
            }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, User, {}, import("mongoose").DefaultSchemaOptions> & User & Required<{
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
