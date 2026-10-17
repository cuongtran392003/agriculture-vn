"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const users_module_1 = require("./modules/users/users.module");
const auth_module_1 = require("./modules/auth/auth.module");
const tasks_module_1 = require("./modules/tasks/tasks.module");
const plot_module_1 = require("./modules/plot/plot.module");
const farm_module_1 = require("./modules/farm/farm.module");
const schedule_1 = require("@nestjs/schedule");
const market_module_1 = require("./modules/market/market.module");
const crop_care_module_1 = require("./modules/crop-care/crop-care.module");
const crops_module_1 = require("./modules/crops/crops.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => {
                    const uri = configService.get('MONGODB_URI') ??
                        (process.env.NODE_ENV === 'production'
                            ? undefined
                            : 'mongodb://127.0.0.1:27017/agricultureVN');
                    if (!uri) {
                        throw new Error('MONGODB_URI is required in production. Set it in the environment or .env file.');
                    }
                    return { uri };
                },
                inject: [config_1.ConfigService],
            }),
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            tasks_module_1.TaskModule,
            plot_module_1.PlotModule,
            farm_module_1.FarmModule,
            schedule_1.ScheduleModule.forRoot(),
            market_module_1.MarketModule,
            crop_care_module_1.CropCareModule,
            crops_module_1.CropsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map