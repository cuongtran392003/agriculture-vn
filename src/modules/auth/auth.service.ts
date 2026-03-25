import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { RegisterDto } from "./dto/register.dto";
import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from 'bcrypt'
import { LoginDto } from "./dto/login.dto";
import { ConfigService } from "@nestjs/config";
import { User, UserDocument } from "../users/schema/user.entity";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";


@Injectable()
export class AuthService {

    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) { }

    async register(registerDto: RegisterDto) {
        const existingUser = await this.userModel.findOne({email: registerDto.email})
            if (existingUser) {
                throw new ConflictException('Email already exists')
            }

            const hashedPassword = await bcrypt.hash(registerDto.password, 10)

            const user = await this.userModel.create({
                name: registerDto.name,
                email: registerDto.email,
                password: hashedPassword,
                role: registerDto.role
            })

            const token = this.generateToken(user)
            return {
                message: "Register successful",
                data: { token, user }
            }
    }

    async login(loginDto: LoginDto) {
        console.log(loginDto)
        const user = await this.userModel.findOne({email: loginDto.email})
        console.log(user)   
        if (!user) {
            throw new UnauthorizedException('Invalid credentials')
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password)
        console.log(isPasswordValid)
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials')
        }
        const token = this.generateToken(user)
        return {
            message: "Login successful",
            data: { token, user }
        }
    }

    private generateToken(user: any) {
        const payload = { sub: user._id, email: user.email }
        return {
            accessToken: this.jwtService.sign(payload),
            refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' })
        }
    }


    async refreshToken (refreshToken: string) {
        try {
            const payload = this.jwtService.verify(refreshToken,{
                secret:this.configService.get<string>('JWT_SECRET')
            })
            const user = await this.userModel.findById(payload.sub)
            if(!user){
                throw new UnauthorizedException('User not found')
            }
            const token = this.generateToken(user)
            return {
                message: 'Refresh token successful',
                data:{token}
            }
        } catch (error) {
            throw new UnauthorizedException('Invalid refresh token')
        }
    }
}