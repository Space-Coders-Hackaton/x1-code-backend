import { Repository } from 'typeorm';
import { NotFoundError } from 'routing-controllers';
import { Service } from 'typedi';

import { User } from '@database/entities/user';

import { InjectRepository } from 'typeorm-typedi-extensions';
import { UpdateUserProps } from '../types';

@Service()
export class UpdateUserService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  async update(id: string, partial: UpdateUserProps): Promise<User> {
    const user = await this.repository.findOne({ where: { id } });

    if (!user) throw new NotFoundError();

    this.repository.merge(user, partial);

    const updated = await this.repository.save(user);

    return updated;
  }
}
