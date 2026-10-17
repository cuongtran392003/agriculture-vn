

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Farm, FarmSchema } from './schema/farm.entity';
import { Plot, PlotSchema } from '../plot/schema/plot.schema';
import { Task, TaskSchema } from '../tasks/schema/task.schema';
import { FarmController } from './farm.controller';
import { FarmService } from './farm.service';



@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Farm.name, schema: FarmSchema },
      { name: Plot.name, schema: PlotSchema },
      { name: Task.name, schema: TaskSchema },
    ]),
  ],
  controllers: [FarmController],
  providers: [FarmService],
  exports: [FarmService],  
})
export class FarmModule { }
