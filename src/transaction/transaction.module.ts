import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { AggregatorModule } from '../aggregator/aggregator.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SyncState, SyncStateSchema } from './../state/state.schema';

@Module({
  imports: [
    AggregatorModule,
    MongooseModule.forFeature([
      { name: SyncState.name, schema: SyncStateSchema },
    ]),
  ],
  providers: [TransactionService],
})
export class TransactionModule {}
