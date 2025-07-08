import { Injectable, OnModuleInit } from '@nestjs/common';
import { AggregatorService } from '../aggregator/aggregator.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TransactionService implements OnModuleInit {
  constructor(
    private readonly aggregatorService: AggregatorService
  ) {}

  onModuleInit() {
    setInterval(() => this.fetchMockData(), 12000); // every 12s
  }

  async fetchMockData() {
    const tx = {
      _id: uuidv4(),
      userId: '074092',
      type: ['earned', 'spent', 'payout', 'requested'][Math.floor(Math.random() * 4)],
      amount: Math.floor(Math.random() * 100),
      createdAt: new Date()
    };
    await this.aggregatorService.updateFromTransaction(tx);
    console.log(`[Mock API] Stored transaction for user ${tx.userId}`);
  }
}