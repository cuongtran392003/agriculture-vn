import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './schema/task.schema';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TaskReminderService } from './task-reminder.service';
import { UsersModule } from '../users/users.module';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
    UsersModule
  ],
  controllers: [TasksController],
  providers: [TasksService, TaskReminderService],
  exports: [TasksService],  
})
export class TaskModule { }
