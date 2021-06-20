import 'reflect-metadata';

import express from 'express';
import cors from 'cors';
import sgMail from '@sendgrid/mail';

import { home } from '@utils/home';
import { started } from '@utils/started';
import { SERVER_PORT, SERVER_URL, SENDGRID_API_KEY } from '@config/env';

import { routes } from './routes';

import './database';

const app = express();

sgMail.setApiKey(SENDGRID_API_KEY);

app.use(express.json());
app.use(cors());

routes(app);
app.get('/', home);

app.listen(SERVER_PORT, () => started(SERVER_PORT, SERVER_URL));
