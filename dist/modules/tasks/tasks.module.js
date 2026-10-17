"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const task_schema_1 = require("./schema/task.schema");
const tasks_controller_1 = require("./tasks.controller");
const tasks_service_1 = require("./tasks.service");
const task_reminder_service_1 = require("./task-reminder.service");
const users_module_1 = require("../users/users.module");
const farm_entity_1 = require("../farm/schema/farm.entity");
const plot_schema_1 = require("../plot/schema/plot.schema");
let TaskModule = class TaskModule {
};
exports.TaskModule = TaskModule;
exports.TaskModule = TaskModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: task_schema_1.Task.name, schema: task_schema_1.TaskSchema },
                { name: farm_entity_1.Farm.name, schema: farm_entity_1.FarmSchema },
                { name: plot_schema_1.Plot.name, schema: plot_schema_1.PlotSchema },
            ]),
            users_module_1.UsersModule
        ],
        controllers: [tasks_controller_1.TasksController],
        providers: [tasks_service_1.TasksService, task_reminder_service_1.TaskReminderService],
        exports: [tasks_service_1.TasksService],
    })
], TaskModule);
//# sourceMappingURL=tasks.module.js.map