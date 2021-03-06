import { FindConditions, Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Service } from 'typedi';

import { Page } from '@shared/pagination';
import { User } from '@database/entities/user';

import { UserQueryParams, UserDTO } from '../types';
import { createUserDTO } from './utils/create-user-dto';

@Service()
export class FindUserService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  public async findPage(query: UserQueryParams): Promise<Page<UserDTO>> {
    const where: FindConditions<User> = {};

    const { page, size } = query;
    if (query.email) {
      where.email = query.email;
    }

    const options = query.paginate<User>({
      select: ['id', 'email'],
      relations: ['roles'],
      where,
    });

    const [select, count] = await this.repository.findAndCount(options);

    const users = select.map(createUserDTO);

    return new Page(await Promise.all(users), count, page, size);
  }

  public async findOne(id: string): Promise<UserDTO> {
    return createUserDTO(
      await this.repository.findOne({
        where: { id },
        select: ['id', 'name', 'email'],
        relations: ['roles'],
      }),
    );
  }
}
