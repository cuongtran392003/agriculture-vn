

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Plot, PlotSchema } from './schema/plot.schema';
import { PlotController } from './plot.controller';
import { PlotService } from './plot.service';




@Module({
  imports: [
    MongooseModule.forFeature([{ name: Plot.name, schema: PlotSchema }]),
  ],
  controllers: [PlotController],
  providers: [PlotService],
  exports: [PlotService],  
})
export class PlotModule { }
