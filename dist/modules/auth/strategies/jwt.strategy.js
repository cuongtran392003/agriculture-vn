"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const config_1 = require("@nestjs/config");
const users_service_1 = require("../../users/users.service");
const secrets_1 = require("../../../common/config/secrets");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    configService;
    usersService;
    constructor(configService, usersService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: (0, secrets_1.getJwtSecret)(configService),
        });
        this.configService = configService;
        this.usersService = usersService;
    }
    async validate(payload) {
        const legacyRefreshToken = !payload.tokenType && payload.iat && payload.exp && payload.exp - payload.iat > 2 * 24 * 60 * 60;
        if (payload.tokenType === 'refresh' || (payload.tokenType && payload.tokenType !== 'access') || legacyRefreshToken) {
            throw new common_1.UnauthorizedException('Invalid access token');
        }
        const user = await this.usersService.findOne(payload.sub);
        if (!user) {
            throw new common_1.UnauthorizedException();
        }
        return user;
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        users_service_1.UsersService])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map