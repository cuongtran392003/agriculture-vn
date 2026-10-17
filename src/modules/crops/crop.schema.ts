import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Crop {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true, trim: true, maxlength: 100 })
  name: string;

  @Prop({ trim: true, maxlength: 100 })
  variety?: string;

  @Prop({ maxlength: 2000 })
  description?: string;

  @Prop({ type: [String], default: [] })
  regions: string[];
}

export const CropSchema = SchemaFactory.createForClass(Crop);
CropSchema.index({ userId: 1, createdAt: -1 });
