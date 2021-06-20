import { InjectRepository } from 'typeorm-typedi-extensions';
import { NotFoundError } from 'routing-controllers';
import { differenceInDays } from 'date-fns';
import { Repository } from 'typeorm';
import { Service } from 'typedi';

import { User } from '@database/entities/user';
import { Correction } from '@database/entities/correction';

import { HttpStatus } from '@shared/web/HttpStatus';
import { HttpStatusError } from '@shared/errors/HttpStatusError';
import axios from 'axios';
import { CORRECTION_TOKEN, CORRECTION_URL } from '@config/env';
import { SendChallengeToCorrectionProps } from '../types/SendChallengeToCorrectionProps';

@Service()
export class SendChallengeToCorrectionService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Correction)
    private correctionRepository: Repository<Correction>,
  ) {}

  async execute({
    user_id,
    challenge_slug,
    technology,
    difficulty,
    repository_url,
    template_url,
  }: SendChallengeToCorrectionProps): Promise<void> {
    const checkUserExists = await this.userRepository.findOne(user_id);

    if (!checkUserExists) throw new NotFoundError('Usuário não existente');

    const correctionExists = await this.correctionRepository.findOne({
      where: { user_id, challenge_slug },
      order: { created_at: 'DESC' },
    });

    const daysDifference = differenceInDays(correctionExists?.created_at, new Date());
    if (correctionExists && daysDifference < 7)
      throw new HttpStatusError(HttpStatus.FORBIDDEN, 'Limite de uma solução por semana.');

    try {
      await axios.post(
        `${CORRECTION_URL}/send`,
        {
          user_id,
          challenge_slug,
          technology,
          difficulty,
          repository_url,
          template_url,
        },
        {
          headers: {
            access_token: `Token ${CORRECTION_TOKEN}`,
          },
        },
      );
    } catch (err) {
      throw new HttpStatusError(err.response.status, err.response.data.message);
    }
  }
}
