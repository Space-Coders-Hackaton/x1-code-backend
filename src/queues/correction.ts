import { Container } from 'typedi';

import { Difficulty } from '@database/entities/correction';
import { CreateCorrectionService } from '@modules/corrections/services';
import { correctionQueue } from '..';

export interface IResultData {
  user_id: string;
  challenge_slug: string;
  difficulty: Difficulty;
  technology: string;
  total_tests: number;
  passed_tests: number;
  repository_url: string;
}

correctionQueue.on('completed', async (job, result: IResultData) => {
  const { user_id, challenge_slug, difficulty, technology, total_tests, passed_tests, repository_url } = result;
  const createCorrection = Container.get(CreateCorrectionService);

  await createCorrection.create({
    user_id,
    challenge_slug,
    difficulty,
    technology,
    total_tests,
    passed_tests,
    repository_url,
  });

  console.log(`Job completed with result ${result}`);
});

correctionQueue.on('failed', async (job, err) => {
  console.error(err);
});
