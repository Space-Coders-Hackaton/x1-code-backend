import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository } from 'typeorm';
import { Inject, Service } from 'typedi';
import {
  Get,
  JsonController,
  Param,
  Post,
  Body,
  Put,
  OnUndefined,
  Delete,
  QueryParams,
  OnNull,
  Authorized,
  CurrentUser,
} from 'routing-controllers';

import { User } from '@database/entities/user';

import { Page } from '@shared/pagination';
import { Session } from '@shared/auth';
import { HttpStatusError } from '@shared/errors/HttpStatusError';
import { HttpStatus } from '@shared/web/HttpStatus';
import {
  CreateUserByGithubService,
  CreateUserProps,
  CreateUserService,
  FindUserService,
  UpdateUserProps,
  UpdateUserService,
  UserDTO,
  UserQueryParams,
} from '../services';
import { CreateUserGithubProps, CreateUserGithubResponse } from '../types';

@Service()
@JsonController('/users')
export class UsersController {
  constructor(
    @Inject()
    private createUserService: CreateUserService,

    @Inject()
    private readonly findUserService: FindUserService,

    @Inject()
    private updateUserService: UpdateUserService,

    @Inject()
    private createUserByGithubService: CreateUserByGithubService,

    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  @Authorized(['ADM'])
  @Get()
  async list(@QueryParams() query: UserQueryParams): Promise<Page<UserDTO>> {
    return this.findUserService.findPage(query);
  }

  @Authorized(['USER'])
  @Get('/:id')
  @OnUndefined(404)
  async show(@Param('id') id: string, @CurrentUser() session: Session): Promise<UserDTO> {
    if (session.roles.every((role) => role !== 'ADM') && session.id !== id) {
      throw new HttpStatusError(HttpStatus.FORBIDDEN, 'Permissão invalida para este recurso.');
    }
    return this.findUserService.findOne(id);
  }

  @Post()
  async store(@Body() user: CreateUserProps): Promise<User> {
    return this.createUserService.create(user);
  }

  @Post('/github')
  async createWithGithub(@Body() user: CreateUserGithubProps): Promise<CreateUserGithubResponse> {
    return this.createUserByGithubService.create({ name: user.name, email: user.email });
  }

  @Authorized(['USER'])
  @Put('/:id')
  async update(@Param('id') id: string, @Body() user: UpdateUserProps, @CurrentUser() session: Session): Promise<User> {
    if (session.roles.every((role) => role !== 'ADM') && session.id !== id) {
      throw new HttpStatusError(HttpStatus.FORBIDDEN, 'Permissão invalida para este recurso.');
    }
    return this.updateUserService.update(id, user);
  }

  @Authorized(['ADM'])
  @Delete('/:id')
  @OnUndefined(200)
  @OnNull(404)
  async destroy(@Param('id') id: string): Promise<null | undefined> {
    const user = await this.repository.findOne({ where: { id } });

    if (!user) {
      return null;
    }

    await this.repository.delete(user.id);
    return undefined;
  }
}
