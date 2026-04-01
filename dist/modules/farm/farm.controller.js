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
exports.FarmController = void 0;
const common_1 = require("@nestjs/common");
const farm_service_1 = require("./farm.service");
const create_farm_dto_1 = require("./dto/create-farm.dto");
const update_farm_dto_1 = require("./dto/update-farm.dto");
let FarmController = class FarmController {
    farmService;
    constructor(farmService) {
        this.farmService = farmService;
    }
    async create(createFarmDto) {
        return await this.farmService.create(createFarmDto);
    }
    async findAll(userId) {
        if (userId) {
            return await this.farmService.findByUserId(userId);
        }
        return await this.farmService.findAll();
    }
    async findOne(id) {
        return await this.farmService.findOne(id);
    }
    async update(id, updateFarmDto) {
        return await this.farmService.update(id, updateFarmDto);
    }
    async remove(id) {
        return await this.farmService.remove(id);
    }
};
exports.FarmController = FarmController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_farm_dto_1.CreateFarmDto]),
    __metadata("design:returntype", Promise)
], FarmController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("userId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FarmController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FarmController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_farm_dto_1.UpdateFarmDto]),
    __metadata("design:returntype", Promise)
], FarmController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FarmController.prototype, "remove", null);
exports.FarmController = FarmController = __decorate([
    (0, common_1.Controller)("farm"),
    __metadata("design:paramtypes", [farm_service_1.FarmService])
], FarmController);
//# sourceMappingURL=farm.controller.js.map