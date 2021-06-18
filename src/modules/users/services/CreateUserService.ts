import { InjectRepository } from 'typeorm-typedi-extensions';
import { DeepPartial, Equal, Repository } from 'typeorm';
import { hash } from 'bcryptjs';
import { Service } from 'typedi';

import { HttpStatusError } from '@shared/errors/HttpStatusError';

import { Role } from '@database/entities/role';
import { User } from '@database/entities/user';

import { HttpStatus } from '@shared/web/HttpStatus';

import { CreateUserProps } from '../types';

@Service()
export class CreateUserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async create({ name, email, password }: CreateUserProps): Promise<User> {
    const exists = await this.userRepository.findOne({
      where: { email },
    });

    if (exists) {
      throw new HttpStatusError(HttpStatus.BAD_REQUEST, 'Email já esta sendo utilizado.');
    }

    const user: DeepPartial<User> = {
      name,
      email,
      password: await hash(password, 8),
    };

    const role = await this.roleRepository.findOne({
      where: { initials: Equal('USER') },
      select: ['id'],
    });
    user.roles = [role];

    const newUser = await this.userRepository.save(user);

    delete user.password;

    return newUser;
  }
}
