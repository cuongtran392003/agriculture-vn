

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Farm, FarmSchema } from './schema/farm.entity';
import { FarmController } from './farm.controller';
import { FarmService } from './farm.service';



@Module({
  imports: [
    MongooseModule.forFeature([{ name: Farm.name, schema: FarmSchema }]),
  ],
  controllers: [FarmController],
  providers: [FarmService],
  exports: [FarmService],  
})
export class FarmModule { }
