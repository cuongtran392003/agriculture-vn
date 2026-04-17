import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument, HydrateOptions } from "mongoose";

export type UserDocument = HydratedDocument<User>

@Schema()
export class User extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    role: string;

    @Prop()
    fcmToken: string;

    @Prop()
    lastActive: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
