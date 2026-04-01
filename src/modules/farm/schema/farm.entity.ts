import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type FarmDocument = HydratedDocument<Farm>;

@Schema({ timestamps: true })
export class Farm {
  @Prop({ type: Types.ObjectId, ref: "User", required: true, index: true })
  userId?: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop()
  location?: string;
}

export const FarmSchema = SchemaFactory.createForClass(Farm);