import path from 'path';

import { Express } from 'express';
import { RoutingControllersOptions, useExpressServer, getMetadataArgsStorage, useContainer } from 'routing-controllers';

import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import * as swaggerUiExpress from 'swagger-ui-express';

import Container from 'typedi';
import { AuthorizationChecker } from '@modules/global/middlewares/AuthorizationChecker';
import { CurrentUserChecker } from '@modules/global/middlewares/CurrentUserChecker';

export const routes = (app: Express): void => {
  useContainer(Container);

  const options: RoutingControllersOptions = {
    defaultErrorHandler: false,
    validation: true,
    authorizationChecker: AuthorizationChecker,
    currentUserChecker: CurrentUserChecker,
    routePrefix: '/api',
    cors: true,
    development: true,
    defaults: {
      nullResultCode: 404,
      undefinedResultCode: 204,
      paramOptions: {
        required: true,
      },
    },

    controllers: [path.join(__dirname, '..', '/modules/**/controllers/*{.ts,.js}')],
    middlewares: [path.join(__dirname, '..', '/modules/**/middlewares/*{.ts,.js}')],
    interceptors: [path.join(__dirname, '..', '/modules/**/interceptors/*{.ts,.js}')],
  };

  useExpressServer(app, options);

  const schemas = validationMetadatasToSchemas({
    refPointerPrefix: '#/components/schemas/',
  });

  const storage = getMetadataArgsStorage();
  const specifications = routingControllersToSpec(storage, options, {
    components: {
      schemas,
      securitySchemes: {
        jwt: {
          scheme: 'bearer',
          type: 'http',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ jwt: [] }],
    // openapi: '3.0.0',
    info: {
      title: 'CRUD-API',
      version: '1.0.0',
      description: 'This is a REST API application made with Express. It retrieves data from Manoel Neto.',
      license: {
        name: 'Licensed Under MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'Manoel Neto',
        url: 'https://progamo.com.br',
      },
    },
  });

  if (process.env.SHOW_DOCS === 'true') {
    app.use('/api-docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specifications, { explorer: true }));
  }
};
