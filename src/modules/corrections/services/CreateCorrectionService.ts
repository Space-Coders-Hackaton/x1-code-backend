import { Inject, Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository } from 'typeorm';
import { differenceInDays } from 'date-fns';
import path from 'path';

import { Correction } from '@database/entities/correction';
import { User } from '@database/entities/user';

import { HttpStatusError } from '@shared/errors/HttpStatusError';
import { HttpStatus } from '@shared/web/HttpStatus';
import { SendGridMailProvider } from '@shared/providers/MailProvider/implementations/SendGridMailProvider';
import { CreateCorrectionProps } from '../types';

@Service()
export class CreateCorrectionService {
  constructor(
    @InjectRepository(Correction)
    private correctionRepository: Repository<Correction>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @Inject()
    private mailProvider: SendGridMailProvider,
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
    const checkUserExists = await this.userRepository.findOne(user_id);
    if (!checkUserExists) {
      throw new HttpStatusError(HttpStatus.NOT_FOUND, 'Usuário não encontrado.');
    }

    const correctionExists = await this.correctionRepository.findOne({
      where: { user_id, challenge_slug },
      order: { created_at: 'DESC' },
    });

    const daysDifference = differenceInDays(correctionExists?.created_at, new Date());
    if (correctionExists && daysDifference < 7) {
      const correctionLimitTemplate = path.resolve(__dirname, '..', 'views', 'correction_limit.hbs');

      await this.mailProvider.sendMail({
        to: { email: checkUserExists.email },
        subject: '[X1 Code] O limite de resolução para este desafio foi excedido!',
        templateData: {
          file: correctionLimitTemplate,
          variables: {
            days: 7 - daysDifference,
          },
        },
      });

      throw new HttpStatusError(HttpStatus.FORBIDDEN, 'Limite de uma solução por semana.');
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

    const correctionCompletedTemplate = path.resolve(__dirname, '..', 'views', 'correction_completed.hbs');

    await this.mailProvider.sendMail({
      to: { email: checkUserExists.email },
      subject: '[X1 Code] A resolução para seu desafio foi concluída',
      templateData: {
        file: correctionCompletedTemplate,
        variables: {
          rating,
          points,
        },
      },
    });

    return correction;
  }
}
