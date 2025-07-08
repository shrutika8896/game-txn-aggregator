import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserAggregate } from './aggregator.schema';

@Injectable()
export class AggregatorService {
  constructor(@InjectModel(UserAggregate.name) private model: Model<UserAggregate>) {}

  getUserSummary(userId: string) {
    return this.model.find({userId: userId}).lean();
  }

  getPayouts() {
    return this.model.find({ payout: { $gt: 0 } }, { _id: 1, payout: 1 }).lean();
  }

  async updateFromTransaction(tx: any) {
    const update: any = { $inc: {}, $set: {} };
    if (tx.type === 'earned') update.$inc.earned = tx.amount;
    if (tx.type === 'spent') update.$inc.spent = tx.amount;
    if (tx.type === 'payout') update.$inc.paidOut = tx.amount;
    if (tx.type === 'requested') update.$inc.payout = tx.amount;
    const existing = await this.model.findOne({userId: tx.userId});
    const newBalance = (existing?.earned || 0) + (update.$inc.earned || 0) - (existing?.spent || 0) - (existing?.paidOut || 0);
    update.$set.balance = newBalance;
    await this.model.updateOne({ userId: tx.userId }, update, { upsert: true });
  }
}