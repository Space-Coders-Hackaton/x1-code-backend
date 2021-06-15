import { Role } from '@database/entities/role';
import { User } from '@database/entities/user';

export interface UserDTO extends Omit<User, 'roles'> {
  roles: Omit<Role, 'name' | 'createdAt' | 'updatedAt'>[];
}
