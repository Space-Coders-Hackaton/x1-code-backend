import { InjectRepository } from 'typeorm-typedi-extensions';
import { NotFoundError } from 'routing-controllers';
import { Repository } from 'typeorm';
import { Service } from 'typedi';

import { User } from '@database/entities/user';
import { deleteFile } from '@utils/file';

@Service()
export class UpdateUserAvatarService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async update(user_id: string, avatar_filename: string): Promise<User> {
    const user = await this.userRepository.findOne(user_id);

    if (!user) throw new NotFoundError();

    if (user.avatar) {
      deleteFile(`./tmp/avatar/${user.avatar}`);
    }

    user.avatar = avatar_filename;

    await this.userRepository.save(user);

    return user;
  }
}
