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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskSchema = exports.Task = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Task = class Task {
    carePlanId;
    careKey;
    careAction;
    growthStage;
    careBaseTime;
    careRainThresholdMm;
    careHeatThresholdC;
    weatherBlocked;
    carePaused;
    weatherNote;
    userId;
    farmId;
    plotId;
    title;
    description;
    cropName;
    scheduledDate;
    scheduledTime;
    status;
    priority;
    note;
    completedAt;
    reminderAt;
    isNotified;
    reminderClaimedAt;
};
exports.Task = Task;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'CarePlan', index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Task.prototype, "carePlanId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Task.prototype, "careKey", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Task.prototype, "careAction", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Task.prototype, "growthStage", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Task.prototype, "careBaseTime", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Task.prototype, "careRainThresholdMm", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Task.prototype, "careHeatThresholdC", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Task.prototype, "weatherBlocked", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Task.prototype, "carePaused", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Task.prototype, "weatherNote", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "User", required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Task.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Farm", required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Task.prototype, "farmId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Plot", index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Task.prototype, "plotId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Task.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Task.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Task.prototype, "cropName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], Task.prototype, "scheduledDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Task.prototype, "scheduledTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ["pending", "completed", "cancelled"], default: "pending", index: true }),
    __metadata("design:type", String)
], Task.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ["low", "medium", "high"], default: "medium" }),
    __metadata("design:type", String)
], Task.prototype, "priority", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Task.prototype, "note", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Task.prototype, "completedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ index: true }),
    __metadata("design:type", Date)
], Task.prototype, "reminderAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false, index: true }),
    __metadata("design:type", Boolean)
], Task.prototype, "isNotified", void 0);
__decorate([
    (0, mongoose_1.Prop)({ index: true }),
    __metadata("design:type", Date)
], Task.prototype, "reminderClaimedAt", void 0);
exports.Task = Task = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Task);
exports.TaskSchema = mongoose_1.SchemaFactory.createForClass(Task);
exports.TaskSchema.index({ carePlanId: 1, careKey: 1 }, { unique: true, partialFilterExpression: { carePlanId: { $exists: true }, careKey: { $exists: true } } });
//# sourceMappingURL=task.schema.js.map