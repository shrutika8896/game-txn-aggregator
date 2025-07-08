import { Controller, Get, Param } from '@nestjs/common';
import { AggregatorService } from './aggregator.service';

@Controller()
export class AggregatorController {
  constructor(private readonly aggregatorService: AggregatorService) {}

  @Get('/user/:userId/summary')
  getUserSummary(@Param('userId') userId: string) {
    return this.aggregatorService.getUserSummary(userId);
  }

  @Get('/payouts')
  getPayouts() {
    return this.aggregatorService.getPayouts();
  }
}