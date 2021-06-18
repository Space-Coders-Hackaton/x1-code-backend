import { InjectRepository } from 'typeorm-typedi-extensions';
import { Equal, Repository } from 'typeorm';
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
    const userAlreadyExists = await this.userRepository.findOne({
      where: { email },
    });

    if (userAlreadyExists) {
      throw new HttpStatusError(HttpStatus.BAD_REQUEST, 'Email já esta sendo utilizado.');
    }

    const role = await this.roleRepository.findOne({
      where: { initials: Equal('USER') },
      select: ['id'],
    });

    const hashedPassword = await hash(password, 8);

    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      roles: [role],
    });

    await this.userRepository.save(user);

    delete user.password;

    return user;
  }
}
