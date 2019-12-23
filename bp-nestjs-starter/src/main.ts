import { INestApplication, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { appConfig } from './config/app.config';
import { EntityNotFoundFilter } from './core/exception/entity-not-found.filter';
import { QueryFailedFilter } from './core/exception/query-failed.filter';
import { env } from './environment/env';
import session = require('express-session');

const port = env.port;
const logger = new Logger('main');

async function bootstrap(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule);

  if (env.allowedHosts) {
    app.enableCors({ credentials: true, origin: env.allowedHosts });
  }

  app.use(session({
    secret: env.secretKey,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: env.isProduction, maxAge: appConfig.jwtLifeTime, sameSite: true },
  }));
  app.use(cookieParser(env.secretKey));

  app.useGlobalFilters(new EntityNotFoundFilter());
  app.useGlobalFilters(new QueryFailedFilter());

  await app.listen(port);
  return app;
}

bootstrap().then(() => {
  if (!env.isProduction) {
    logger.log(`Serving the app at http://localhost:${port}`);
  }
}).catch(err => logger.error(err));
