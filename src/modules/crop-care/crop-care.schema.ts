import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { CareStageDto } from './crop-care.dto';

@Schema({ timestamps: true })
export class CareTemplate {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;
  @Prop({ required: true }) cropName: string;
  @Prop({ required: true }) region: string;
  @Prop({ required: true }) source: string;
  @Prop({ type: [Object], required: true }) stages: CareStageDto[];
}
export const CareTemplateSchema = SchemaFactory.createForClass(CareTemplate);

@Schema({ timestamps: true })
export class CarePlan {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'Farm', required: true })
  farmId: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'Plot' }) plotId?: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'CareTemplate', required: true })
  templateId: Types.ObjectId;
  @Prop({ required: true }) cropName: string;
  @Prop({ required: true }) region: string;
  @Prop({ required: true }) plantingDate: string;
  @Prop({ required: true }) scheduleAnchor: string;
  @Prop({ type: [Object], required: true }) stages: CareStageDto[];
  @Prop({ required: true }) latitude: number;
  @Prop({ required: true }) longitude: number;
  @Prop({ default: true, index: true }) active: boolean;
  @Prop() weatherCheckedAt?: Date;
}
export const CarePlanSchema = SchemaFactory.createForClass(CarePlan);
