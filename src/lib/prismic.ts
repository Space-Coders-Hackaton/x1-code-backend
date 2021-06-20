import Prismic from '@prismicio/client';
import { PRISMIC_ENDPOINT, PRISMIC_ACCESS_TOKEN } from '@config/env';

export const getPrismicClient = () => {
  return Prismic.client(PRISMIC_ENDPOINT, {
    accessToken: PRISMIC_ACCESS_TOKEN,
  });
};
