import { Request, Response } from 'express';

import { SERVER_PORT, SERVER_URL, NODE_ENV, SHOW_DOCS } from 'config/env';

type Greeting = {
  message: string;
  documentation: string;
  environment: string;
};

export const home = (_req: Request, res: Response): Response<Greeting> =>
  res.json({
    environment: NODE_ENV,
    documentation: `${SHOW_DOCS === 'true' && `${SERVER_URL}:${SERVER_PORT}/api-docs`}`,
    message: 'Is a live!',
  });
