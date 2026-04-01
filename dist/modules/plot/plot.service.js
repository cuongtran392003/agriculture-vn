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
exports.PlotService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const plot_schema_1 = require("./schema/plot.schema");
const mongoose_2 = require("mongoose");
let PlotService = class PlotService {
    plotModel;
    constructor(plotModel) {
        this.plotModel = plotModel;
    }
    async create(createPlotDto) {
        const plot = await this.plotModel.create(createPlotDto);
        return {
            message: "Plot created successfully",
            data: plot,
        };
    }
    async findAll() {
        const plots = await this.plotModel
            .find()
            .populate("farmId", "name")
            .sort({ createdAt: -1 });
        return {
            message: "Plots fetched successfully",
            data: plots,
        };
    }
    async findOne(id) {
        const plot = await this.plotModel
            .findById(id)
            .populate("farmId", "name");
        if (!plot) {
            throw new common_1.NotFoundException(`Plot with id ${id} not found`);
        }
        return {
            message: "Plot fetched successfully",
            data: plot,
        };
    }
    async findByFarmId(farmId) {
        const plots = await this.plotModel
            .find({ farmId })
            .sort({ createdAt: -1 });
        return {
            message: "Plots fetched successfully",
            data: plots,
        };
    }
    async update(id, updatePlotDto) {
        const plot = await this.plotModel.findByIdAndUpdate(id, updatePlotDto, {
            new: true,
        });
        if (!plot) {
            throw new common_1.NotFoundException(`Plot with id ${id} not found`);
        }
        return {
            message: "Plot updated successfully",
            data: plot,
        };
    }
    async remove(id) {
        const plot = await this.plotModel.findByIdAndDelete(id);
        if (!plot) {
            throw new common_1.NotFoundException(`Plot with id ${id} not found`);
        }
        return {
            message: "Plot deleted successfully",
            data: plot,
        };
    }
};
exports.PlotService = PlotService;
exports.PlotService = PlotService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(plot_schema_1.Plot.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], PlotService);
//# sourceMappingURL=plot.service.js.map