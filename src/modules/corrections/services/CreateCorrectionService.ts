import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository } from 'typeorm';
import { differenceInWeeks } from 'date-fns';

import { Correction } from '@database/entities/correction';
import { User } from '@database/entities/user';

import { HttpStatusError } from '@shared/errors/HttpStatusError';
import { HttpStatus } from '@shared/web/HttpStatus';
import { CreateCorrectionProps } from '../types';

@Service()
export class CreateCorrectionService {
  constructor(
    @InjectRepository(Correction)
    private correctionRepository: Repository<Correction>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create({
    user_id,
    challenge_slug,
    difficulty,
    technology,
    total_tests,
    passed_tests,
    repository_url,
  }: CreateCorrectionProps): Promise<Correction> {
    const correctionExists = await this.correctionRepository.findOne({
      where: { user_id, challenge_slug },
    });
    if (correctionExists && differenceInWeeks(correctionExists.created_at, new Date()) < 1) {
      throw new HttpStatusError(HttpStatus.FORBIDDEN, 'Limite de uma solução por semana.');
    }

    const checkUserExists = this.userRepository.findOne(user_id);
    if (!checkUserExists) {
      throw new HttpStatusError(HttpStatus.NOT_FOUND, 'Usuário não encontrado.');
    }

    const rating = (passed_tests / total_tests) * 10;

    const difficultyPoints = { easy: 2, normal: 4, hard: 6 };
    const points = passed_tests * difficultyPoints[difficulty];

    const correction = this.correctionRepository.create({
      user_id,
      challenge_slug,
      difficulty,
      technology,
      rating,
      points,
      total_tests,
      passed_tests,
      repository_url,
    });

    await this.correctionRepository.save(correction);

    return correction;
  }
}
