import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Farm, FarmSchema } from '../farm/schema/farm.entity';
import { Plot, PlotSchema } from '../plot/schema/plot.schema';
import { Task, TaskSchema } from '../tasks/schema/task.schema';
import {
  CarePlan,
  CarePlanSchema,
  CareTemplate,
  CareTemplateSchema,
} from './crop-care.schema';
import { CropCareController } from './crop-care.controller';
import { CropCareService } from './crop-care.service';
import { CareWeatherService } from './crop-care.weather';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CarePlan.name, schema: CarePlanSchema },
      { name: CareTemplate.name, schema: CareTemplateSchema },
      { name: Task.name, schema: TaskSchema },
      { name: Farm.name, schema: FarmSchema },
      { name: Plot.name, schema: PlotSchema },
    ]),
  ],
  controllers: [CropCareController],
  providers: [CropCareService, CareWeatherService],
})
export class CropCareModule {}
