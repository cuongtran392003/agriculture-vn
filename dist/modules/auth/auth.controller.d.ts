import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
declare class RefreshTokenDto {
    refreshToken: string;
}
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        data: {
            token: {
                accessToken: string;
                refreshToken: string;
            };
            user: (import("mongoose").Document<unknown, {}, import("../users/schema/user.entity").User, {}, import("mongoose").DefaultSchemaOptions> & import("../users/schema/user.entity").User & Required<{
                _id: import("mongoose").Types.ObjectId;
            }> & {
                __v: number;
            } & {
                id: string;
            }) | null;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        message: string;
        data: {
            token: {
                accessToken: string;
                refreshToken: string;
            };
            user: (import("mongoose").Document<unknown, {}, import("../users/schema/user.entity").User, {}, import("mongoose").DefaultSchemaOptions> & import("../users/schema/user.entity").User & Required<{
                _id: import("mongoose").Types.ObjectId;
            }> & {
                __v: number;
            } & {
                id: string;
            }) | null;
        };
    }>;
    refresh(body: RefreshTokenDto): Promise<{
        message: string;
        data: {
            token: {
                accessToken: string;
                refreshToken: string;
            };
        };
    }>;
}
export {};
