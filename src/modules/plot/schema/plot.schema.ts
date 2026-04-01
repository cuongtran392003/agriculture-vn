import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type PlotDocument = HydratedDocument<Plot>;

@Schema({ timestamps: true })
export class Plot {
  @Prop({ type: Types.ObjectId, ref: "Farm", required: true, index: true })
  farmId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop()
  code?: string;

  @Prop()
  description?: string;
}

export const PlotSchema = SchemaFactory.createForClass(Plot);