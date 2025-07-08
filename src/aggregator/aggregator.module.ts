import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AggregatorService } from './aggregator.service';
import { AggregatorController } from './aggregator.controller';
import { UserAggregate, UserAggregateSchema } from './aggregator.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserAggregate.name, schema: UserAggregateSchema }
    ])
  ],
  providers: [AggregatorService],
  controllers: [AggregatorController],
  exports: [AggregatorService]
})
export class AggregatorModule {}