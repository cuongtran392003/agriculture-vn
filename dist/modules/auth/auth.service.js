"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jwt_1 = require("@nestjs/jwt");
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
const config_1 = require("@nestjs/config");
const user_entity_1 = require("../users/schema/user.entity");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const secrets_1 = require("../../common/config/secrets");
let AuthService = class AuthService {
    jwtService;
    configService;
    userModel;
    constructor(jwtService, configService, userModel) {
        this.jwtService = jwtService;
        this.configService = configService;
        this.userModel = userModel;
    }
    async register(registerDto) {
        const existingUser = await this.userModel.findOne({ email: registerDto.email.toLowerCase() });
        if (existingUser) {
            throw new common_1.ConflictException('Email already exists');
        }
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        let user;
        try {
            user = await this.userModel.create({
                name: registerDto.name,
                email: registerDto.email.toLowerCase(),
                password: hashedPassword,
                role: "farmer"
            });
        }
        catch (error) {
            if (error?.code === 11000)
                throw new common_1.ConflictException('Email already exists');
            throw error;
        }
        const token = this.generateToken(user);
        const safeUser = await this.userModel.findById(user._id).select('-password').lean();
        return {
            message: "Register successful",
            data: { token, user: safeUser }
        };
    }
    async login(loginDto) {
        const user = await this.userModel.findOne({ email: loginDto.email.toLowerCase() });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const token = this.generateToken(user);
        const safeUser = await this.userModel.findById(user._id).select('-password').lean();
        return {
            message: "Login successful",
            data: { token, user: safeUser }
        };
    }
    generateToken(user) {
        const payload = { sub: user._id, email: user.email };
        return {
            accessToken: this.jwtService.sign({ ...payload, tokenType: 'access' }),
            refreshToken: this.jwtService.sign({ ...payload, tokenType: 'refresh' }, { expiresIn: '7d' })
        };
    }
    async refreshToken(refreshToken) {
        let payload;
        try {
            payload = this.jwtService.verify(refreshToken, {
                secret: (0, secrets_1.getJwtSecret)(this.configService),
            });
            const legacyRefreshToken = !payload.tokenType && payload.iat && payload.exp && payload.exp - payload.iat >= 6 * 24 * 60 * 60;
            if (payload.tokenType !== 'refresh' && !legacyRefreshToken)
                throw new Error('Not a refresh token');
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        const user = await this.userModel.findById(payload.sub);
        if (!user)
            throw new common_1.UnauthorizedException('User not found');
        const token = this.generateToken(user);
        return { message: 'Refresh token successful', data: { token } };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, mongoose_2.InjectModel)(user_entity_1.User.name)),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService,
        mongoose_1.Model])
], AuthService);
//# sourceMappingURL=auth.service.js.map