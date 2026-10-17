import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { Model, Types, isValidObjectId } from 'mongoose';
import { Farm } from '../farm/schema/farm.entity';
import { Plot } from '../plot/schema/plot.schema';
import { Task } from '../tasks/schema/task.schema';
import { CreateCarePlanDto, CreateCareTemplateDto } from './crop-care.dto';
import { CarePlan, CareTemplate } from './crop-care.schema';
import {
  addDays,
  buildCareSchedule,
  dateValue,
  localToday,
  weatherDecision,
} from './crop-care.scheduler';
import { CareWeatherService } from './crop-care.weather';

const TITLES = {
  watering: 'Tưới nước',
  fertilizing: 'Bón phân',
  pruning: 'Tỉa cành',
  harvesting: 'Thu hoạch',
};

@Injectable()
export class CropCareService {
  private readonly logger = new Logger(CropCareService.name);
  constructor(
    @InjectModel(CareTemplate.name) private templates: Model<CareTemplate>,
    @InjectModel(CarePlan.name) private plans: Model<CarePlan>,
    @InjectModel(Task.name) private tasks: Model<Task>,
    @InjectModel(Farm.name) private farms: Model<Farm>,
    @InjectModel(Plot.name) private plots: Model<Plot>,
    private weather: CareWeatherService,
  ) {}

  async createTemplate(userId: string, dto: CreateCareTemplateDto) {
    const names = new Set<string>();
    for (const stage of dto.stages) {
      if (names.has(stage.name))
        throw new BadRequestException('Tên giai đoạn bị trùng');
      names.add(stage.name);
      const ids = new Set<string>();
      for (const rule of stage.rules) {
        if (ids.has(rule.id) || rule.day >= stage.durationDays)
          throw new BadRequestException(
            'Mã công việc bị trùng hoặc ngày vượt quá giai đoạn',
          );
        ids.add(rule.id);
      }
    }
    return {
      message: 'Đã tạo mẫu chăm sóc',
      data: await this.templates.create({ ...dto, userId }),
    };
  }

  async listTemplates(userId: string) {
    return {
      message: 'Danh sách mẫu chăm sóc',
      data: await this.templates
        .find({ userId })
        .sort({ createdAt: -1 })
        .limit(100)
        .lean(),
    };
  }

  private async checkOwnership(
    userId: string,
    farmId: string | Types.ObjectId,
    plotId?: string | Types.ObjectId,
  ) {
    if (!(await this.farms.exists({ _id: farmId, userId })))
      throw new ForbiddenException(
        'Nông trại không thuộc tài khoản hoặc đã bị xóa',
      );
    if (plotId && !(await this.plots.exists({ _id: plotId, farmId, userId })))
      throw new ForbiddenException(
        'Mảnh đất không thuộc nông trại hoặc đã bị xóa',
      );
  }

  async createPlan(userId: string, dto: CreateCarePlanDto) {
    await this.checkOwnership(userId, dto.farmId, dto.plotId);
    const template = await this.templates.findOne({
      _id: dto.templateId,
      userId,
    });
    if (!template) throw new NotFoundException('Không tìm thấy mẫu chăm sóc');
    dateValue(dto.plantingDate);
    let anchor = dto.plantingDate;
    if (dto.currentStage) {
      const index = template.stages.findIndex(
        (stage) => stage.name === dto.currentStage,
      );
      if (index < 0)
        throw new BadRequestException('Giai đoạn không có trong mẫu chăm sóc');
      if (!dto.stageStartedOn)
        throw new BadRequestException('Cần ngày bắt đầu giai đoạn đã chọn');
      dateValue(dto.stageStartedOn);
      if (
        dto.stageStartedOn < dto.plantingDate ||
        dto.stageStartedOn > localToday()
      )
        throw new BadRequestException(
          'Ngày bắt đầu giai đoạn phải từ ngày gieo trồng đến hôm nay',
        );
      const offset = template.stages
        .slice(0, index)
        .reduce((total, stage) => total + stage.durationDays, 0);
      anchor = addDays(dto.stageStartedOn, -offset);
    } else if (dto.stageStartedOn) {
      throw new BadRequestException(
        'Cần chọn giai đoạn khi nhập ngày bắt đầu giai đoạn',
      );
    }
    const plan = await this.plans.create({
      userId,
      farmId: dto.farmId,
      plotId: dto.plotId,
      templateId: template._id,
      plantingDate: dto.plantingDate,
      scheduleAnchor: anchor,
      cropName: template.cropName,
      region: template.region,
      stages: template.stages,
      latitude: dto.latitude,
      longitude: dto.longitude,
    });
    // The plan persists even if generation fails; the cron and sync endpoint can retry safely.
    const result = await this.syncPlan(plan);
    return { message: 'Đã tạo kế hoạch chăm sóc', data: { plan, ...result } };
  }

  async listPlans(userId: string) {
    return {
      message: 'Danh sách kế hoạch chăm sóc',
      data: await this.plans
        .find({ userId })
        .sort({ createdAt: -1 })
        .limit(100)
        .lean(),
    };
  }

  private async ownedPlan(id: string, userId: string) {
    if (!isValidObjectId(id))
      throw new NotFoundException('Không tìm thấy kế hoạch');
    const plan = await this.plans.findOne({ _id: id, userId });
    if (!plan) throw new NotFoundException('Không tìm thấy kế hoạch');
    return plan;
  }

  async detail(id: string, userId: string) {
    const plan = await this.ownedPlan(id, userId);
    let offset = 0;
    const today = localToday();
    const stage = plan.stages.find((item) => {
      const start = addDays(plan.scheduleAnchor, offset);
      offset += item.durationDays;
      return today >= start && today < addDays(plan.scheduleAnchor, offset);
    });
    return {
      message: 'Chi tiết kế hoạch chăm sóc',
      data: {
        plan,
        currentStage: stage?.name ?? null,
        tasks: await this.tasks
          .find({
            carePlanId: plan._id,
            userId,
            scheduledDate: { $gte: today },
          })
          .sort({ scheduledDate: 1, scheduledTime: 1 })
          .limit(500)
          .lean(),
      },
    };
  }

  async setActive(id: string, userId: string, active: boolean) {
    const plan = await this.ownedPlan(id, userId);
    if (active) await this.checkOwnership(userId, plan.farmId, plan.plotId);
    plan.active = active;
    await plan.save();
    await this.tasks.updateMany(
      { carePlanId: plan._id, userId, status: 'pending' },
      { $set: { carePaused: !active } },
    );
    if (active) await this.syncPlan(plan);
    return {
      message: active
        ? 'Đã tiếp tục kế hoạch'
        : 'Đã tạm dừng kế hoạch và nhắc lịch',
      data: plan,
    };
  }

  async sync(id: string, userId: string) {
    const plan = await this.ownedPlan(id, userId);
    if (!plan.active) throw new BadRequestException('Kế hoạch đang tạm dừng');
    await this.checkOwnership(userId, plan.farmId, plan.plotId);
    return {
      message: 'Đã đồng bộ lịch chăm sóc',
      data: await this.syncPlan(plan),
    };
  }

  private async syncPlan(plan: CarePlan & { _id: Types.ObjectId }) {
    const today = localToday();
    const entries = buildCareSchedule(plan.stages, plan.scheduleAnchor, today);
    if (entries.length) {
      try {
        await this.tasks.bulkWrite(
          entries.map((entry) => ({
            updateOne: {
              filter: { carePlanId: plan._id, careKey: entry.key },
              update: {
                $setOnInsert: {
                  userId: plan.userId,
                  farmId: plan.farmId,
                  plotId: plan.plotId,
                  carePlanId: plan._id,
                  careKey: entry.key,
                  careAction: entry.rule.action,
                  growthStage: entry.stage,
                  cropName: plan.cropName,
                  title: `${TITLES[entry.rule.action]} - ${plan.cropName}`,
                  description: `${entry.rule.guidance}\nKhu vực: ${plan.region}. Giai đoạn: ${entry.stage}.`,
                  scheduledDate: entry.date,
                  scheduledTime: entry.rule.time,
                  careBaseTime: entry.rule.time,
                  careRainThresholdMm: entry.rule.rainThresholdMm,
                  careHeatThresholdC: entry.rule.heatThresholdC,
                  reminderAt: new Date(
                    `${entry.date}T${entry.rule.time}:00+07:00`,
                  ),
                  status: 'pending',
                  priority: 'medium',
                  isNotified: false,
                  carePaused: false,
                  weatherBlocked: false,
                },
              },
              upsert: true,
            },
          })),
          { ordered: false },
        );
      } catch (error) {
        // Concurrent syncs may both try to insert the same occurrence. The unique
        // index keeps one task; other write failures must still reach the caller.
        if (
          error?.code !== 11000 ||
          !error.writeErrors?.length ||
          error.writeErrors.some(
            (failure: { code: number }) => failure.code !== 11000,
          )
        )
          throw error;
      }
    }
    let weatherStatus = 'updated';
    let adjusted = 0;
    try {
      const forecast = await this.weather.forecast(
        plan.latitude,
        plan.longitude,
      );
      const pending = await this.tasks.find({
        carePlanId: plan._id,
        status: 'pending',
        isNotified: false,
        scheduledDate: { $gte: today, $lt: addDays(today, 7) },
      });
      for (const task of pending) {
        const day = forecast.get(task.scheduledDate);
        if (!day || !task.careBaseTime || !task.careAction) continue;
        const decision = weatherDecision(
          task.careAction,
          task.careBaseTime,
          day.rain,
          day.temperature,
          task.careRainThresholdMm,
          task.careHeatThresholdC,
        );
        // Do not move a reminder earlier into the past when weather is refreshed mid-day.
        const reminderAt = new Date(
          `${task.scheduledDate}T${decision.time}:00+07:00`,
        );
        if (
          decision.time !== task.scheduledTime &&
          reminderAt.getTime() <= Date.now()
        )
          decision.time = task.scheduledTime ?? task.careBaseTime;
        const changed = await this.tasks.updateOne(
          {
            _id: task._id,
            status: 'pending',
            isNotified: false,
            reminderClaimedAt: { $exists: false },
            carePaused: { $ne: true },
          },
          {
            $set: {
              scheduledTime: decision.time,
              reminderAt: new Date(
                `${task.scheduledDate}T${decision.time}:00+07:00`,
              ),
              weatherBlocked: decision.blocked,
              weatherNote: decision.note,
            },
          },
        );
        adjusted += changed.modifiedCount;
      }
      await this.plans.updateOne(
        { _id: plan._id },
        { $set: { weatherCheckedAt: new Date() } },
      );
    } catch (error) {
      weatherStatus = 'unavailable';
      this.logger.warn(
        `Weather sync failed for plan ${plan._id}: ${error.message}`,
      );
    }
    return {
      scheduledTasks: entries.length,
      weatherStatus,
      adjustedTasks: adjusted,
    };
  }

  @Cron('0 */6 * * *', { timeZone: 'Asia/Bangkok' })
  async refreshPlans() {
    for await (const plan of this.plans.find({ active: true }).cursor()) {
      try {
        await this.checkOwnership(
          plan.userId.toString(),
          plan.farmId,
          plan.plotId,
        );
        await this.syncPlan(plan);
      } catch (error) {
        if (error instanceof ForbiddenException) {
          await this.plans.updateOne(
            { _id: plan._id },
            { $set: { active: false } },
          );
          await this.tasks.updateMany(
            { carePlanId: plan._id, status: 'pending' },
            { $set: { carePaused: true } },
          );
        }
        this.logger.warn(
          `Care sync failed for plan ${plan._id}: ${error.message}`,
        );
      }
    }
  }
}
