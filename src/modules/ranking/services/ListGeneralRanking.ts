import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { Correction } from '@database/entities/correction';
import { RankingResponse } from '../types/RankingResponse';

interface IRankingResponse {
  user_id: string;
  user_name: string;
  points: number;
  total_challenges: number;
}

@Service()
export class ListGeneralRanking {
  constructor(
    @InjectRepository(Correction)
    private correctionsRepository: Repository<Correction>,
  ) {}

  async list(): Promise<RankingResponse[]> {
    const ranking = await this.correctionsRepository
      .createQueryBuilder('c')
      .innerJoinAndSelect('c.user', 'user', 'user.id = c.user_id')
      .select(['c.user_id AS user_id', 'SUM(c.points) AS points', 'COUNT(c.user_id) AS total_challenges'])
      .addSelect(['user.id', 'user.name'])
      .groupBy('c.user_id')
      .addGroupBy('user.id')
      .orderBy('points', 'DESC')
      .getRawMany<IRankingResponse>();

    const formattedRanking: RankingResponse[] = ranking.map(({ points, total_challenges, user_name, user_id }) => ({
      points,
      total_challenges,
      user: {
        id: user_id,
        name: user_name,
      },
    }));

    return formattedRanking;
  }
}
