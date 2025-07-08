import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class SyncState extends Document {
  @Prop({ required: true }) key: string;
  @Prop({ required: true }) value: string;
}

export const SyncStateSchema = SchemaFactory.createForClass(SyncState);