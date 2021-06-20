import { NotFoundError } from 'routing-controllers';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Equal, Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { Service } from 'typedi';

import { User } from '@database/entities/user';

import { TOKEN_EXPIRY, TOKEN_SECRET } from '@config/env';
import { Role } from '@database/entities/role';
import { CreateUserGithubProps, CreateUserGithubResponse } from '../types';

@Service()
export class CreateUserByGithubService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async create({ name, email }: CreateUserGithubProps): Promise<CreateUserGithubResponse> {
    const userAlreadyExists = await this.userRepository.findOne({
      where: { email },
      relations: ['roles'],
    });

    if (userAlreadyExists) {
      if (!userAlreadyExists.github) {
        throw new NotFoundError('Email já esta sendo utilizado.');
      } else {
        const roles = userAlreadyExists.roles.map((role) => role.initials);
        const token = sign({ roles }, TOKEN_SECRET, {
          subject: userAlreadyExists.id,
          expiresIn: TOKEN_EXPIRY,
        });

        delete userAlreadyExists.password;

        return { user: userAlreadyExists, token };
      }
    }

    const role = await this.roleRepository.findOne({
      where: { initials: Equal('USER') },
      select: ['id', 'initials'],
    });

    const user = this.userRepository.create({
      name,
      email,
      roles: [role],
      github: true,
    });

    await this.userRepository.save(user);

    const roles = user.roles.map((role) => role.initials);

    const token = sign({ roles }, TOKEN_SECRET, {
      subject: user.id,
      expiresIn: TOKEN_EXPIRY,
    });

    delete user.password;

    return { user, token };
  }
}
