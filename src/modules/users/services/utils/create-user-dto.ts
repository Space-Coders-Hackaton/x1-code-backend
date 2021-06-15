import { User } from '@database/entities/user';

import { UserDTO } from '../../types';

export const createUserDTO = ({ roles, ...user }: User): UserDTO => ({
  ...user,
  roles: roles.map(({ id, initials }) => ({ id, initials })),
});
