import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class UserAggregate extends Document {
  @Prop({ required: true })
  userId: string;
  @Prop({ default: 0 }) earned: number;
  @Prop({ default: 0 }) spent: number;
  @Prop({ default: 0 }) payout: number;
  @Prop({ default: 0 }) paidOut: number;
  @Prop({ default: 0 }) balance: number;
}

export const UserAggregateSchema = SchemaFactory.createForClass(UserAggregate);
