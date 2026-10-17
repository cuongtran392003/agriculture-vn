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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const user_entity_1 = require("./schema/user.entity");
const mongoose_2 = require("mongoose");
const bcrypt = __importStar(require("bcrypt"));
const farm_entity_1 = require("../farm/schema/farm.entity");
let UsersService = class UsersService {
    userModel;
    farmModel;
    constructor(userModel, farmModel) {
        this.userModel = userModel;
        this.farmModel = farmModel;
    }
    async create(createUserDto) {
        try {
            const password = await bcrypt.hash(createUserDto.password, 10);
            const user = await this.userModel.create({
                name: createUserDto.name,
                email: createUserDto.email.toLowerCase(),
                password,
                role: 'farmer',
            });
            return {
                message: 'User created successfully',
                data: await this.userModel.findById(user._id).select('-password'),
            };
        }
        catch (error) {
            if (error?.code === 11000) {
                throw new common_1.ConflictException('Email already exists');
            }
            throw error;
        }
    }
    findAll() {
        const user = this.userModel.find().select('-password');
        return {
            message: 'User fetched successfully',
            data: user
        };
    }
    findOne(id) {
        return this.userModel.findById(id).select('-password');
    }
    forbidden() { throw new common_1.ForbiddenException('You can only access your own account'); }
    async update(id, updateUserDto) {
        try {
            const updates = {};
            if (updateUserDto.name !== undefined)
                updates.name = updateUserDto.name;
            if (updateUserDto.email !== undefined)
                updates.email = updateUserDto.email.toLowerCase();
            const user = await this.userModel.findByIdAndUpdate(id, updates, {
                new: true,
                runValidators: true,
                projection: { password: 0 },
            });
            if (!user)
                throw new common_1.NotFoundException('User not found');
            return {
                message: 'User updated successfully',
                data: user
            };
        }
        catch (error) {
            if (error?.code === 11000) {
                throw new common_1.ConflictException('Email already exists');
            }
            throw error;
        }
    }
    async remove(id) {
        if (await this.farmModel.exists({ userId: id })) {
            throw new common_1.ConflictException('Delete this account’s farms before deleting the account');
        }
        const user = await this.userModel.findByIdAndDelete(id).select('-password');
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return { message: 'User deleted successfully', data: user };
    }
    async findByEmail(email) {
        return await this.userModel.findOne({ email });
    }
    async updateToken(userId, token) {
        if (!userId || !token) {
            throw new common_1.BadRequestException('Thiếu UserId hoặc Token');
        }
        const updatedUser = await this.userModel.findByIdAndUpdate(userId, { $set: { fcmToken: token } }, { new: true, projection: { password: 0 } });
        if (!updatedUser) {
            throw new common_1.NotFoundException('User không tồn tại');
        }
        return updatedUser;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_entity_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(farm_entity_1.Farm.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], UsersService);
//# sourceMappingURL=users.service.js.map