import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { AggregatorModule } from '../aggregator/aggregator.module';

@Module({
  imports: [
    AggregatorModule
  ],
  providers: [TransactionService],
})
export class TransactionModule {}