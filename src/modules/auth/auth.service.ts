import { JwtService } from "@nestjs/jwt";
import { RegisterDto } from "./dto/register.dto";
import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from 'bcrypt'
import { LoginDto } from "./dto/login.dto";
import { ConfigService } from "@nestjs/config";
import { User, UserDocument } from "../users/schema/user.entity";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { getJwtSecret } from '../../common/config/secrets';


@Injectable()
export class AuthService {

    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) { }

    async register(registerDto: RegisterDto) {
        const existingUser = await this.userModel.findOne({email: registerDto.email.toLowerCase()})
            if (existingUser) {
                throw new ConflictException('Email already exists')
            }

            const hashedPassword = await bcrypt.hash(registerDto.password, 10)

            let user: UserDocument;
            try {
                user = await this.userModel.create({
                    name: registerDto.name,
                    email: registerDto.email.toLowerCase(),
                    password: hashedPassword,
                    role: "farmer"
                });
            } catch (error) {
                if (error?.code === 11000) throw new ConflictException('Email already exists');
                throw error;
            }

            const token = this.generateToken(user)
            const safeUser = await this.userModel.findById(user._id).select('-password').lean();
            return {
                message: "Register successful",
                data: { token, user: safeUser }
            }
    }

    async login(loginDto: LoginDto) {
        const user = await this.userModel.findOne({email: loginDto.email.toLowerCase()})
        if (!user) {
            throw new UnauthorizedException('Invalid credentials')
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password)
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials')
        }
        const token = this.generateToken(user)
        const safeUser = await this.userModel.findById(user._id).select('-password').lean();
        return {
            message: "Login successful",
            data: { token, user: safeUser }
        }
    }

    private generateToken(user: any) {
        const payload = { sub: user._id, email: user.email }
        return {
            accessToken: this.jwtService.sign({ ...payload, tokenType: 'access' }),
            refreshToken: this.jwtService.sign({ ...payload, tokenType: 'refresh' }, { expiresIn: '7d' })
        }
    }


    async refreshToken (refreshToken: string) {
        let payload: { sub: string; tokenType?: string; iat?: number; exp?: number };
        try {
            payload = this.jwtService.verify(refreshToken,{
                secret: getJwtSecret(this.configService),
            })
            const legacyRefreshToken = !payload.tokenType && payload.iat && payload.exp && payload.exp - payload.iat >= 6 * 24 * 60 * 60;
            if (payload.tokenType !== 'refresh' && !legacyRefreshToken) throw new Error('Not a refresh token');
        } catch (error) {
            throw new UnauthorizedException('Invalid refresh token')
        }
        const user = await this.userModel.findById(payload.sub);
        if (!user) throw new UnauthorizedException('User not found');
        const token = this.generateToken(user);
        return { message: 'Refresh token successful', data: { token } };
    }
}
