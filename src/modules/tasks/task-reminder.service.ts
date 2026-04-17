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

  // Chạy mỗi phút một lần
  @Cron(CronExpression.EVERY_MINUTE)
  async handleTaskReminders() {
    this.logger.debug('Đang quét các task đến hạn thông báo...');

    const now = new Date();

    try {
      // 1. Tìm các task đến hạn (reminderAt <= hiện tại) và chưa được thông báo
      const pendingTasks = await this.taskModel.find({
        reminderAt: { $lte: now },
        isNotified: false,
        status: 'pending', // Chỉ nhắc các việc chưa hoàn thành
      });

      if (pendingTasks.length === 0) return;

      this.logger.log(`Tìm thấy ${pendingTasks.length} task cần gửi thông báo.`);

      for (const task of pendingTasks) {
        // 2. Lấy thông tin User để lấy fcmToken
        const user = await this.userModel.findById(task.userId);

        if (user && user.fcmToken) {
          const message: admin.messaging.Message = {
            notification: {
              title: `🌱 Lịch làm nông: ${task.title}`,
              body: task.description || 'Đã đến giờ thực hiện công việc bạn đã hẹn.',
            },
            // Dữ liệu kèm theo để Expo Router điều hướng
            data: {
              screen: '/(tabs)/tasks', 
              taskId: task._id.toString(),
            },
            token: user.fcmToken,
          };

          // 3. Gửi thông báo qua Firebase
          await admin.messaging().send(message);
          
          // 4. Cập nhật trạng thái đã thông báo để không gửi lại ở phút kế tiếp
          await this.taskModel.updateOne(
            { _id: task._id },
            { $set: { isNotified: true } }
          );

          this.logger.log(`✅ Đã gửi thông báo cho Task: ${task.title} (User: ${user.email})`);
        } else {
          // Nếu không có token, cũng đánh dấu là xong hoặc xử lý tùy bạn
          await this.taskModel.updateOne({ _id: task._id }, { $set: { isNotified: true } });
          this.logger.warn(`⚠️ Không tìm thấy fcmToken cho User: ${task.userId}`);
        }
      }
    } catch (error) {
      this.logger.error('❌ Lỗi trong quá trình chạy Cron Job:', error.message);
    }
  }
}