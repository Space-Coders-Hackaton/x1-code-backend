import { InjectRepository } from 'typeorm-typedi-extensions';
import { NotFoundError } from 'routing-controllers';
import { differenceInDays } from 'date-fns';
import { Repository } from 'typeorm';
import { Service } from 'typedi';

import { Correction } from '@database/entities/correction';
import { User } from '@database/entities/user';

import { ShowCorrectionResponse, ShowUserCorrectionProps } from '../types';

@Service()
export class ShowUserChallengeService {
  constructor(
    @InjectRepository(Correction)
    private correctionRepository: Repository<Correction>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async show({ user_id, challenge_slug }: ShowUserCorrectionProps): Promise<ShowCorrectionResponse> {
    const checkUserExists = await this.userRepository.findOne(user_id);
    if (!checkUserExists) throw new NotFoundError('Usuário não encontrado');

    const correction = await this.correctionRepository.findOne({
      where: { user_id, challenge_slug },
      order: { created_at: 'DESC' },
    });

    if (!correction) {
      return {
        pending: false,
        daysTimeout: null,
        last_correction: null,
        correction: null,
      };
    }

    const daysDifference = differenceInDays(correction.created_at, new Date());
    const pending = daysDifference < 7;

    return {
      pending,
      daysTimeout: daysDifference,
      last_correction: correction.created_at,
      correction,
    };
  }
}
