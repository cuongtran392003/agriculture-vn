

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Plot, PlotSchema } from './schema/plot.schema';
import { PlotController } from './plot.controller';
import { PlotService } from './plot.service';
import { Farm, FarmSchema } from '../farm/schema/farm.entity';
import { Task, TaskSchema } from '../tasks/schema/task.schema';




@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Plot.name, schema: PlotSchema },
      { name: Farm.name, schema: FarmSchema },
      { name: Task.name, schema: TaskSchema },
    ]),
  ],
  controllers: [PlotController],
  providers: [PlotService],
  exports: [PlotService],  
})
export class PlotModule { }
