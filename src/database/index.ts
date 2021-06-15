import { createConnection, useContainer } from 'typeorm';
import { Container } from 'typeorm-typedi-extensions';

if (process.env.DB_HOST) {
  useContainer(Container);
  createConnection();
}
