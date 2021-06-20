import { Get, JsonController } from 'routing-controllers';
import { Inject, Service } from 'typedi';

import { ListGeneralStatsService } from '../services';
import { StatsResponse } from '../types';

@Service()
@JsonController('/stats')
export class StatsController {
  constructor(
    @Inject()
    private listGeneralStatsService: ListGeneralStatsService,
  ) {}

  @Get('/')
  async list(): Promise<StatsResponse> {
    return this.listGeneralStatsService.list();
  }
}
