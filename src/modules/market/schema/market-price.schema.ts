import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MarketPriceDocument = HydratedDocument<MarketPrice>;

@Schema()
export class MarketPrice {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, min: 1 })
  price: number;

  @Prop({ required: true })
  change: string;

  @Prop({ required: true })
  updatedAt: Date;
}

export const MarketPriceSchema = SchemaFactory.createForClass(MarketPrice);
