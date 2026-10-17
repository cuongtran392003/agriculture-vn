import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type TaskDocument = HydratedDocument<Task>;

@Schema({ timestamps: true })
export class Task {
  @Prop({ type: Types.ObjectId, ref: 'CarePlan', index: true }) carePlanId?: Types.ObjectId;
  @Prop() careKey?: string;
  @Prop() careAction?: string;
  @Prop() growthStage?: string;
  @Prop() careBaseTime?: string;
  @Prop() careRainThresholdMm?: number;
  @Prop() careHeatThresholdC?: number;
  @Prop({ default: false }) weatherBlocked?: boolean;
  @Prop({ default: false }) carePaused?: boolean;
  @Prop() weatherNote?: string;
  @Prop({ type: Types.ObjectId, ref: "User", required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Farm", required: true, index: true })
  farmId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Plot", index: true })
  plotId?: Types.ObjectId;



  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop()
  cropName?: string;

  @Prop({ required: true, index: true })
  scheduledDate: string;

  @Prop()
  scheduledTime?: string;

  @Prop({ enum: ["pending", "completed", "cancelled"], default: "pending", index: true })
  status: string;

  @Prop({ enum: ["low", "medium", "high"], default: "medium" })
  priority: string;

  @Prop()
  note?: string;

  @Prop()
  completedAt?: Date;

  @Prop({index:true})
  reminderAt?: Date;

  @Prop({default: false, index:true})
  isNotified: boolean

  @Prop({ index: true })
  reminderClaimedAt?: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
TaskSchema.index({ carePlanId: 1, careKey: 1 }, { unique: true, partialFilterExpression: { carePlanId: { $exists: true }, careKey: { $exists: true } } });
