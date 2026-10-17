import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './schema/task.schema';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TaskReminderService } from './task-reminder.service';
import { UsersModule } from '../users/users.module';
import { Farm, FarmSchema } from '../farm/schema/farm.entity';
import { Plot, PlotSchema } from '../plot/schema/plot.schema';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Task.name, schema: TaskSchema },
      { name: Farm.name, schema: FarmSchema },
      { name: Plot.name, schema: PlotSchema },
    ]),
    UsersModule
  ],
  controllers: [TasksController],
  providers: [TasksService, TaskReminderService],
  exports: [TasksService],  
})
export class TaskModule { }
