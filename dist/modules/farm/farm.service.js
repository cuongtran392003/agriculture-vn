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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FarmService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const farm_entity_1 = require("./schema/farm.entity");
const mongoose_2 = require("mongoose");
let FarmService = class FarmService {
    farmModel;
    constructor(farmModel) {
        this.farmModel = farmModel;
    }
    async create(createFarmDto) {
        const farm = await this.farmModel.create(createFarmDto);
        return {
            message: "Farm created successfully",
            data: farm,
        };
    }
    async findAll() {
        const farms = await this.farmModel
            .find()
            .populate("userId", "name email")
            .sort({ createdAt: -1 });
        return {
            message: "Farms fetched successfully",
            data: farms,
        };
    }
    async findOne(id) {
        const farm = await this.farmModel
            .findById(id)
            .populate("userId", "name email");
        if (!farm) {
            throw new common_1.NotFoundException(`Farm with id ${id} not found`);
        }
        return {
            message: "Farm fetched successfully",
            data: farm,
        };
    }
    async findByUserId(userId) {
        const farms = await this.farmModel
            .find({ userId })
            .sort({ createdAt: -1 });
        return {
            message: "Farms fetched successfully",
            data: farms,
        };
    }
    async update(id, updateFarmDto) {
        const farm = await this.farmModel.findByIdAndUpdate(id, updateFarmDto, {
            new: true,
        });
        if (!farm) {
            throw new common_1.NotFoundException(`Farm with id ${id} not found`);
        }
        return {
            message: "Farm updated successfully",
            data: farm,
        };
    }
    async remove(id) {
        const farm = await this.farmModel.findByIdAndDelete(id);
        if (!farm) {
            throw new common_1.NotFoundException(`Farm with id ${id} not found`);
        }
        return {
            message: "Farm deleted successfully",
            data: farm,
        };
    }
};
exports.FarmService = FarmService;
exports.FarmService = FarmService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(farm_entity_1.Farm.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], FarmService);
//# sourceMappingURL=farm.service.js.map