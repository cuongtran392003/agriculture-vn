import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as admin from 'firebase-admin';
import { Task, TaskDocument } from './schema/task.schema';
import { User, UserDocument } from '../users/schema/user.entity';


@Injectable()
export class TaskReminderService {
  private readonly logger = new Logger(TaskReminderService.name);

  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleTaskReminders() {
    if (!admin.apps.length) {
      this.logger.warn('Firebase is not configured; skipping task reminders.');
      return;
    }
    this.logger.debug('Đang quét các task đến hạn thông báo...');

    const now = new Date();
    const staleClaimBefore = new Date(now.getTime() - 5 * 60 * 1000);

    try {
      // 1. Tìm các task đến hạn (reminderAt <= hiện tại) và chưa được thông báo
      const pendingTasks = await this.taskModel.find({
        reminderAt: { $lte: now },
        isNotified: false,
        status: 'pending', // Chỉ nhắc các việc chưa hoàn thành
        weatherBlocked: { $ne: true },
        carePaused: { $ne: true },
      });

      if (pendingTasks.length === 0) return;

      this.logger.log(`Tìm thấy ${pendingTasks.length} task cần gửi thông báo.`);

      for (const task of pendingTasks) {
        // 2. Lấy thông tin User để lấy fcmToken
        const user = await this.userModel.findById(task.userId);

        if (user && user.fcmToken) {
          const claim = await this.taskModel.updateOne(
            {
              _id: task._id,
              isNotified: false,
              status: 'pending',
              weatherBlocked: { $ne: true },
              carePaused: { $ne: true },
              $or: [
                { reminderClaimedAt: { $exists: false } },
                { reminderClaimedAt: { $lt: staleClaimBefore } },
              ],
            },
            { $set: { reminderClaimedAt: now } },
          );
          if (claim.modifiedCount === 0) continue;
          const message: admin.messaging.Message = {
            notification: {
              title: `🌱 Lịch làm nông: ${task.title}`,
              body: task.description || 'Đã đến giờ thực hiện công việc bạn đã hẹn.',
            },
            // Dữ liệu kèm theo để Expo Router điều hướng
            data: {
              screen: '/(tabs)/schedule', 
            },
            token: user.fcmToken,
          };

          // 3. Gửi thông báo qua Firebase
          try {
            await admin.messaging().send(message);
            await this.taskModel.updateOne(
              { _id: task._id, reminderClaimedAt: now },
              { $set: { isNotified: true }, $unset: { reminderClaimedAt: 1 } },
            );
          } catch (error) {
            await this.taskModel.updateOne({ _id: task._id, reminderClaimedAt: now }, { $unset: { reminderClaimedAt: 1 } });
            if (error?.code === 'messaging/registration-token-not-registered') {
              await this.userModel.updateOne({ _id: user._id }, { $unset: { fcmToken: 1 } });
            }
            this.logger.error(`Failed to send reminder for task ${task._id}: ${error.message}`);
            continue;
          }
          
          // 4. Cập nhật trạng thái đã thông báo để không gửi lại ở phút kế tiếp

          this.logger.log(`✅ Đã gửi thông báo cho Task: ${task.title} (User: ${user.email})`);
        } else {
          // Nếu không có token, cũng đánh dấu là xong hoặc xử lý tùy bạn
          // Leave isNotified false so adding a token later can deliver this reminder.
          this.logger.warn(`⚠️ Không tìm thấy fcmToken cho User: ${task.userId}`);
        }
      }
    } catch (error) {
      this.logger.error('❌ Lỗi trong quá trình chạy Cron Job:', error.message);
    }
  }
}
