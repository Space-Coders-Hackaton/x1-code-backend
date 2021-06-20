import { User } from '@database/entities/user';

export interface CreateUserGithubResponse {
  user: User;
  token: string;
}
