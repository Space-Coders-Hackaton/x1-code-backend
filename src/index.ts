import 'reflect-metadata';

import express from 'express';
import cors from 'cors';
import Queue from 'bull';
import sgMail from '@sendgrid/mail';

import { REDIS_URL, SENDGRID_API_KEY } from '@config/env';
import { home } from '@utils/home';
import { routes } from './routes';

import './database';

const app = express();

sgMail.setApiKey(SENDGRID_API_KEY);

const correctionQueue = new Queue('correction', REDIS_URL);

app.use(express.json());
app.use(cors());

routes(app);
app.get('/', home);

export { correctionQueue, app };
