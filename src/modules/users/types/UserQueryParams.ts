import { FindManyOptions, Like, FindConditions } from 'typeorm';

import { Paginator, Specification } from '@shared/pagination';

import { User } from '@database/entities/user';

export class UserQueryParams extends Paginator implements Specification<User> {
  email?: string;

  getOptions(): FindManyOptions<User> {
    const where: FindConditions<User> = {};

    if (this.email) {
      where.email = Like(`%${this.email}%`);
    }

    return this.paginate({
      where,
    });
  }
}
