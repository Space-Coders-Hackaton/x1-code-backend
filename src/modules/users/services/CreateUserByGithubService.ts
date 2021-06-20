import { NotFoundError } from 'routing-controllers';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Equal, Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { Service } from 'typedi';
import axios from 'axios';

import { User } from '@database/entities/user';

import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, TOKEN_EXPIRY, TOKEN_SECRET } from '@config/env';
import { Role } from '@database/entities/role';
import { CreateUserGithubResponse } from '../types';

@Service()
export class CreateUserByGithubService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async create(code: string): Promise<CreateUserGithubResponse> {
    if (!code) throw new NotFoundError('Código não encontrado.');

    const oauthResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: { accept: 'application/json' },
      },
    );

    const { access_token } = oauthResponse.data;

    const { data } = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `token ${access_token}`,
      },
    });

    const { name, email } = data;

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
