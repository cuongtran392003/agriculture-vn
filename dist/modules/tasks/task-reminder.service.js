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
var TaskReminderService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskReminderService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const admin = __importStar(require("firebase-admin"));
const task_schema_1 = require("./schema/task.schema");
const user_entity_1 = require("../users/schema/user.entity");
let TaskReminderService = TaskReminderService_1 = class TaskReminderService {
    taskModel;
    userModel;
    logger = new common_1.Logger(TaskReminderService_1.name);
    constructor(taskModel, userModel) {
        this.taskModel = taskModel;
        this.userModel = userModel;
    }
    async handleTaskReminders() {
        this.logger.debug('Đang quét các task đến hạn thông báo...');
        const now = new Date();
        try {
            const pendingTasks = await this.taskModel.find({
                reminderAt: { $lte: now },
                isNotified: false,
                status: 'pending',
            });
            if (pendingTasks.length === 0)
                return;
            this.logger.log(`Tìm thấy ${pendingTasks.length} task cần gửi thông báo.`);
            for (const task of pendingTasks) {
                const user = await this.userModel.findById(task.userId);
                if (user && user.fcmToken) {
                    const message = {
                        notification: {
                            title: `🌱 Lịch làm nông: ${task.title}`,
                            body: task.description || 'Đã đến giờ thực hiện công việc bạn đã hẹn.',
                        },
                        data: {
                            screen: '/(tabs)/tasks',
                            taskId: task._id.toString(),
                        },
                        token: user.fcmToken,
                    };
                    await admin.messaging().send(message);
                    await this.taskModel.updateOne({ _id: task._id }, { $set: { isNotified: true } });
                    this.logger.log(`✅ Đã gửi thông báo cho Task: ${task.title} (User: ${user.email})`);
                }
                else {
                    await this.taskModel.updateOne({ _id: task._id }, { $set: { isNotified: true } });
                    this.logger.warn(`⚠️ Không tìm thấy fcmToken cho User: ${task.userId}`);
                }
            }
        }
        catch (error) {
            this.logger.error('❌ Lỗi trong quá trình chạy Cron Job:', error.message);
        }
    }
};
exports.TaskReminderService = TaskReminderService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_MINUTE),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TaskReminderService.prototype, "handleTaskReminders", null);
exports.TaskReminderService = TaskReminderService = TaskReminderService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(task_schema_1.Task.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_entity_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], TaskReminderService);
//# sourceMappingURL=task-reminder.service.js.map