import { Injectable, OnModuleInit } from '@nestjs/common';
import { AggregatorService } from '../aggregator/aggregator.service';
import { v4 as uuidv4 } from 'uuid';
import { SyncState } from '../state/state.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TransactionService implements OnModuleInit {
  constructor(
    private readonly aggregatorService: AggregatorService,
    @InjectModel(SyncState.name) private syncStateModel: Model<SyncState>,
  ) {}

  onModuleInit() {
    setInterval(() => this.fetchInBatches(), 12000); // every 12s
  }

  fetchMockData(afterId: string): any[] {
    // This is a mock implementation. Replace with actual API call.
    // Simulating fetching transactions after a specific ID.
    console.log(`Fetching transactions after ID: ${afterId}`);
    const tx = [
      {
        _id: uuidv4(),
        userId: '074092',
        type: ['earned', 'spent', 'payout', 'requested'][
          Math.floor(Math.random() * 4)
        ],
        amount: Math.floor(Math.random() * 100),
        createdAt: new Date(),
      },
      {
        _id: uuidv4(),
        userId: '074093',
        type: ['earned', 'spent', 'payout', 'requested'][
          Math.floor(Math.random() * 4)
        ],
        amount: Math.floor(Math.random() * 100),
        createdAt: new Date(),
      },
    ];

    return tx;
  }

  async getLastAfterId(): Promise<string> {
    const state = await this.syncStateModel.findOne({ key: 'afterId' });
    return state?.value ?? '';
  }

  async setLastAfterId(id: string) {
    await this.syncStateModel.updateOne(
      { key: 'afterId' },
      { $set: { value: id } },
      { upsert: true },
    );
  }

  async fetchInBatches() {
    const MAX_CALLS = 5;
    let afterId = await this.getLastAfterId();
    let calls = 0;

    while (calls < MAX_CALLS) {
      const txns = this.fetchMockData(afterId); // Replace this with real fetch
      if (txns.length === 0) break;

      for (const tx of txns) {
        await this.aggregatorService.updateFromTransaction(tx);
      }

      afterId = txns[txns.length - 1]._id;
      await this.setLastAfterId(afterId);
      calls++;
    }
  }
}
