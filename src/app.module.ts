import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AggregatorModule } from './aggregator/aggregator.module';
import { TransactionModule } from './transaction/transaction.module';
import { SyncState, SyncStateSchema } from './state/state.schema';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost:27017/game',
    ),
    MongooseModule.forFeature([
      { name: SyncState.name, schema: SyncStateSchema },
    ]),
    AggregatorModule,
    TransactionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
