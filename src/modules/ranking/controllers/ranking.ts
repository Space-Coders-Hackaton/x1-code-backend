import { Get, JsonController, Param } from 'routing-controllers';
import { Inject, Service } from 'typedi';

import { ListGeneralRanking } from '../services/ListGeneralRanking';
import { ListRankingByChallenge } from '../services/ListRankingByChallenge';
import { ListRankingByTechnology } from '../services/ListRankingByTechnology';
import { RankingResponse } from '../types/RankingResponse';

@Service()
@JsonController('/ranking')
export class RankingController {
  constructor(
    @Inject()
    private listGeneralRanking: ListGeneralRanking,

    @Inject()
    private listRankingByTechnology: ListRankingByTechnology,

    @Inject()
    private listRankingByChallenge: ListRankingByChallenge,
  ) {}

  @Get()
  async listGeneral(): Promise<RankingResponse[]> {
    return this.listGeneralRanking.list();
  }

  @Get('/technology/:technology')
  async listTechnology(@Param('technology') technology: string): Promise<RankingResponse[]> {
    return this.listRankingByTechnology.list({ technology });
  }

  @Get('/challenge/:challenge_slug')
  async listChallenge(@Param('challenge_slug') challenge_slug: string): Promise<RankingResponse[]> {
    return this.listRankingByChallenge.list({ challenge_slug });
  }
}
