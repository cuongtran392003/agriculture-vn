import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Crop, CropSchema } from './crop.schema';
import { CropsController } from './crops.controller';
import { CropsService } from './crops.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Crop.name, schema: CropSchema }]),
  ],
  controllers: [CropsController],
  providers: [CropsService],
  exports: [CropsService],
})
export class CropsModule {}
