"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FarmModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const farm_entity_1 = require("./schema/farm.entity");
const plot_schema_1 = require("../plot/schema/plot.schema");
const task_schema_1 = require("../tasks/schema/task.schema");
const farm_controller_1 = require("./farm.controller");
const farm_service_1 = require("./farm.service");
let FarmModule = class FarmModule {
};
exports.FarmModule = FarmModule;
exports.FarmModule = FarmModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: farm_entity_1.Farm.name, schema: farm_entity_1.FarmSchema },
                { name: plot_schema_1.Plot.name, schema: plot_schema_1.PlotSchema },
                { name: task_schema_1.Task.name, schema: task_schema_1.TaskSchema },
            ]),
        ],
        controllers: [farm_controller_1.FarmController],
        providers: [farm_service_1.FarmService],
        exports: [farm_service_1.FarmService],
    })
], FarmModule);
//# sourceMappingURL=farm.module.js.map