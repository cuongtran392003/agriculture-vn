"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlotModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const plot_schema_1 = require("./schema/plot.schema");
const plot_controller_1 = require("./plot.controller");
const plot_service_1 = require("./plot.service");
let PlotModule = class PlotModule {
};
exports.PlotModule = PlotModule;
exports.PlotModule = PlotModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: plot_schema_1.Plot.name, schema: plot_schema_1.PlotSchema }]),
        ],
        controllers: [plot_controller_1.PlotController],
        providers: [plot_service_1.PlotService],
        exports: [plot_service_1.PlotService],
    })
], PlotModule);
//# sourceMappingURL=plot.module.js.map