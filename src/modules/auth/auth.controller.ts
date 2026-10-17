import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { IsJWT } from 'class-validator';
class RefreshTokenDto {
    @IsJWT()
    refreshToken: string;
}

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post('register')
    register(@Body() registerDto: RegisterDto){
        return this.authService.register(registerDto)
    }

    @Post('login')
    login(@Body() loginDto: LoginDto){
        return this.authService.login(loginDto)
    }

    @Post('refresh')
    refresh(@Body() body: RefreshTokenDto){
        return this.authService.refreshToken(body.refreshToken)
    }
}
