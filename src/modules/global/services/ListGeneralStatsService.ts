import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import Prismic from '@prismicio/client';

import { User } from '@database/entities/user';
import { Correction } from '@database/entities/correction';
import { getPrismicClient } from '@lib/prismic';
import { StatsResponse } from '../types';

@Service()
export class ListGeneralStatsService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(User)
    private correctionsRepository: Repository<Correction>,
  ) {}

  async list(): Promise<StatsResponse> {
    const users = await this.usersRepository.count();
    const corrections = await this.correctionsRepository.count();

    const prismic = getPrismicClient();
    const { total_results_size: challenges } = await prismic.query([
      Prismic.Predicates.at('document.type', 'challenge'),
    ]);

    const stats: StatsResponse = {
      users,
      corrections,
      challenges,
    };

    return stats;
  }
}
