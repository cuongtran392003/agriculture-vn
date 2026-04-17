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
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const task_schema_1 = require("./schema/task.schema");
const mongoose_2 = require("mongoose");
const response_dto_1 = require("../../common/dto/response.dto");
let TasksService = class TasksService {
    taskModel;
    constructor(taskModel) {
        this.taskModel = taskModel;
    }
    async create(createTaskDto) {
        try {
            const { scheduledDate, scheduledTime } = createTaskDto;
            console.log('Dữ liệu nhận được:', { scheduledDate, scheduledTime });
            let reminderAt = new Date(scheduledTime || scheduledDate);
            if (scheduledTime && scheduledTime.includes('T')) {
                reminderAt = new Date(scheduledTime);
            }
            if (isNaN(reminderAt.getTime())) {
                throw new Error(`Định dạng ngày giờ không hợp lệ`);
            }
            const task = await this.taskModel.create({
                ...createTaskDto,
                reminderAt,
                isNotified: false,
            });
            return { message: "Task created successfully", data: task };
        }
        catch (error) {
            console.error('Lỗi chi tiết tại Service:', error.message);
            throw error;
        }
    }
    async findAll(userId, paginationDto, farmId, status) {
        const { page = 1, limit = 10 } = paginationDto;
        const skip = (page - 1) * limit;
        const query = { userId };
        if (farmId) {
            query.farmId = farmId;
        }
        if (status) {
            query.status = status;
        }
        const [tasks, total] = await Promise.all([
            this.taskModel
                .find(query)
                .populate("farmId", "name")
                .populate("plotId", "name code")
                .sort({ scheduledDate: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            this.taskModel.countDocuments(query)
        ]);
        return new response_dto_1.ResponseDto(200, "Tasks fetched successfully", tasks, {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            hasNextPage: page < Math.ceil(total / limit),
            hasPrevPage: page > 1,
        });
    }
    async findOne(id) {
        const task = await this.taskModel
            .findById(id)
            .populate("farmId", "name")
            .populate("plotId");
        if (!task) {
            throw new common_1.NotFoundException(`Task with id ${id} not found`);
        }
        return {
            message: "Task fetched successfully",
            data: task,
        };
    }
    async findByUserId(userId) {
        const tasks = await this.taskModel
            .find({ userId })
            .populate("farmId", "name")
            .populate("plotId", "name code")
            .sort({ createdAt: -1 });
        return {
            message: "Tasks fetched successfully",
            data: tasks,
        };
    }
    async findByFarmId(farmId) {
        const tasks = await this.taskModel
            .find({ farmId })
            .populate("plotId")
            .sort({ scheduledDate: -1 });
        return {
            message: "Tasks fetched successfully",
            data: tasks,
        };
    }
    async findByStatus(status) {
        const tasks = await this.taskModel
            .find({ status })
            .populate("farmId", "name")
            .populate("plotId")
            .sort({ scheduledDate: -1 });
        return {
            message: "Tasks fetched successfully",
            data: tasks,
        };
    }
    async update(id, updateTaskDto) {
        if (updateTaskDto.status === "completed") {
            updateTaskDto["completedAt"] = new Date();
        }
        const task = await this.taskModel.findByIdAndUpdate(id, updateTaskDto, {
            new: true,
        });
        if (!task) {
            throw new common_1.NotFoundException(`Task with id ${id} not found`);
        }
        return {
            message: "Task updated successfully",
            data: task,
        };
    }
    async remove(id) {
        const task = await this.taskModel.findByIdAndDelete(id);
        if (!task) {
            throw new common_1.NotFoundException(`Task with id ${id} not found`);
        }
        return {
            message: "Task deleted successfully",
            data: task,
        };
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(task_schema_1.Task.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], TasksService);
//# sourceMappingURL=tasks.service.js.map