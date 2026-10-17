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
const farm_entity_1 = require("../farm/schema/farm.entity");
const plot_schema_1 = require("../plot/schema/plot.schema");
const response_dto_1 = require("../../common/dto/response.dto");
let TasksService = class TasksService {
    taskModel;
    farmModel;
    plotModel;
    constructor(taskModel, farmModel, plotModel) {
        this.taskModel = taskModel;
        this.farmModel = farmModel;
        this.plotModel = plotModel;
    }
    async create(createTaskDto) {
        if (!(0, mongoose_2.isValidObjectId)(createTaskDto.farmId) || !(await this.farmModel.exists({ _id: createTaskDto.farmId, userId: createTaskDto.userId }))) {
            throw new common_1.ForbiddenException('Farm does not belong to the current user');
        }
        if (createTaskDto.plotId && (!(0, mongoose_2.isValidObjectId)(createTaskDto.plotId) || !(await this.plotModel.exists({ _id: createTaskDto.plotId, farmId: createTaskDto.farmId, userId: createTaskDto.userId })))) {
            throw new common_1.ForbiddenException('Plot does not belong to the selected farm');
        }
        try {
            const { scheduledDate, scheduledTime } = createTaskDto;
            console.log('Dữ liệu nhận được:', { scheduledDate, scheduledTime });
            const reminderAt = this.buildReminderAt(scheduledDate, scheduledTime);
            if (isNaN(reminderAt.getTime())) {
                throw new common_1.BadRequestException('Invalid scheduled date or time');
            }
            const task = await this.taskModel.create({
                ...createTaskDto,
                reminderAt,
                isNotified: false,
                ...(createTaskDto.status === 'completed' && { completedAt: new Date() }),
            });
            return { message: "Task created successfully", data: task };
        }
        catch (error) {
            console.error('Lỗi chi tiết tại Service:', error.message);
            throw error;
        }
    }
    buildReminderAt(scheduledDate, scheduledTime) {
        const dateHasTime = scheduledDate.includes('T');
        const calendarDate = dateHasTime ? scheduledDate.slice(0, 10) : scheduledDate;
        const reminderValue = scheduledTime?.includes('T')
            ? scheduledTime
            : dateHasTime && !scheduledTime
                ? scheduledDate
                : `${calendarDate}T${scheduledTime ?? '00:00'}:00+07:00`;
        const reminderAt = new Date(reminderValue);
        if (Number.isNaN(reminderAt.getTime()))
            throw new common_1.BadRequestException('Invalid scheduled date or time');
        return reminderAt;
    }
    async findAll(userId, paginationDto, farmId, status) {
        const { page = 1, limit = 10 } = paginationDto;
        const skip = (page - 1) * limit;
        if (farmId && !(0, mongoose_2.isValidObjectId)(farmId))
            throw new common_1.BadRequestException('Invalid farmId');
        if (status && !['pending', 'completed', 'cancelled'].includes(status))
            throw new common_1.BadRequestException('Invalid task status');
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
    async findOne(id, userId) {
        if (!(0, mongoose_2.isValidObjectId)(id))
            throw new common_1.NotFoundException('Task not found');
        const task = await this.taskModel
            .findOne({ _id: id, userId })
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
    async update(id, userId, updateTaskDto) {
        if (!(0, mongoose_2.isValidObjectId)(id))
            throw new common_1.NotFoundException('Task not found');
        const current = await this.taskModel.findOne({ _id: id, userId });
        if (!current)
            throw new common_1.NotFoundException(`Task with id ${id} not found`);
        const changes = { ...updateTaskDto };
        if (updateTaskDto.plotId && (!(0, mongoose_2.isValidObjectId)(updateTaskDto.plotId) || !(await this.plotModel.exists({
            _id: updateTaskDto.plotId,
            farmId: current.farmId,
            userId,
        })))) {
            throw new common_1.ForbiddenException('Plot does not belong to this task farm');
        }
        if (updateTaskDto.scheduledDate !== undefined || updateTaskDto.scheduledTime !== undefined) {
            changes.reminderAt = this.buildReminderAt(updateTaskDto.scheduledDate ?? current.scheduledDate, updateTaskDto.scheduledTime ?? current.scheduledTime);
            changes.isNotified = false;
        }
        if (updateTaskDto.status === 'completed') {
            changes.completedAt = current.completedAt ?? new Date();
        }
        else if (updateTaskDto.status !== undefined) {
            delete changes.completedAt;
            if (updateTaskDto.status === 'pending')
                changes.isNotified = false;
        }
        const update = { $set: changes };
        const unset = {};
        if (current.carePlanId && (updateTaskDto.scheduledDate !== undefined || updateTaskDto.scheduledTime !== undefined)) {
            changes.weatherBlocked = false;
            unset.careAction = 1;
            unset.careBaseTime = 1;
            unset.weatherNote = 1;
        }
        if (updateTaskDto.status && updateTaskDto.status !== 'completed') {
            unset.completedAt = 1;
        }
        if (updateTaskDto.status !== undefined || updateTaskDto.scheduledDate !== undefined || updateTaskDto.scheduledTime !== undefined) {
            unset.reminderClaimedAt = 1;
        }
        if (Object.keys(unset).length)
            update.$unset = unset;
        const task = await this.taskModel.findOneAndUpdate({ _id: id, userId }, update, {
            new: true,
            runValidators: true,
        });
        if (!task) {
            throw new common_1.NotFoundException(`Task with id ${id} not found`);
        }
        return {
            message: "Task updated successfully",
            data: task,
        };
    }
    async remove(id, userId) {
        if (!(0, mongoose_2.isValidObjectId)(id))
            throw new common_1.NotFoundException('Task not found');
        const task = await this.taskModel.findOneAndDelete({ _id: id, userId });
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
    __param(1, (0, mongoose_1.InjectModel)(farm_entity_1.Farm.name)),
    __param(2, (0, mongoose_1.InjectModel)(plot_schema_1.Plot.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], TasksService);
//# sourceMappingURL=tasks.service.js.map