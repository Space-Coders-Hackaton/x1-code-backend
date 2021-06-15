import 'reflect-metadata';

import express from 'express';
import cors from 'cors';

import { SERVER_PORT, SERVER_URL } from './config/env';
import { started } from './utils/started';
import { home } from './utils/home';
import { routes } from './routes';

import './database';

const app = express();

app.use(express.json());
app.use(cors());

routes(app);
app.get('/', home);

app.listen(SERVER_PORT, () => started(SERVER_PORT, SERVER_URL));
