import { diskStorage } from 'multer';
import { resolve } from 'path';
import { randomBytes } from 'crypto';

import { HttpStatusError } from '@shared/errors/HttpStatusError';
import { HttpStatus } from '@shared/web/HttpStatus';

const fileSize = 1024 * 1024 * 500;
const formats = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg',
  'video/webm',
  'video/mpeg',
  'video/mpeg2',
  'video/mp4',
  'video/avi',
  'video/mkv',
  'video/mov',
  'text/csv',
  'application/zip',
  'application/x-bzip2',
  'application/x-bzip',
  'application/x-7z-compressed',
  'application/x-tar',
  'application/msword',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

export const multerConfig: any = (folder: string) => {
  return {
    dest: resolve(__dirname, '..', '..', 'tmp', folder),
    storage: diskStorage({
      destination: resolve(__dirname, '..', '..', 'tmp', folder),
      filename: (request, file, callback) => {
        randomBytes(16, (error, hash) => {
          if (error) {
            callback(error, file.filename);
          }
          const filename = `${hash.toString('hex')}-${file.originalname}`;
          callback(null, filename);
        });
      },
    }),
    limits: {
      fileSize,
    },
    fileFilter: (request, file, callback) => {
      if (formats.indexOf(file.mimetype) === -1) {
        callback(
          new HttpStatusError(HttpStatus.INTERNAL_SERVER_ERROR, `${file.originalname} is invalid, Only accept.`),
        );
      } else {
        callback(null, true);
      }
    },
  };
};
