import { Inject, Service } from 'typedi';
import { JsonController, Authorized, CurrentUser, Patch, UploadedFile } from 'routing-controllers';

import { User } from '@database/entities/user';
import { multerConfig } from '@config/multer';

import { Session } from '@shared/auth';
import { UpdateUserAvatarService } from '../services';

@Service()
@JsonController('/profile')
export class ProfileController {
  constructor(
    @Inject()
    private updateUserAvatarService: UpdateUserAvatarService,
  ) {}

  @Authorized(['USER'])
  @Patch('/avatar')
  async updateAvatar(
    @UploadedFile('avatar', { options: multerConfig('avatar') }) file: any,
    @CurrentUser() session: Session,
  ): Promise<User> {
    const { id } = session;
    const { filename } = file;

    return this.updateUserAvatarService.update(id, filename);
  }
}
