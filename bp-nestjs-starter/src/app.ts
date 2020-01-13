import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { CsrfGuard } from './auth/csrf.guard';
import { appConfig } from './common/app.config';
import { EntityNotFoundFilter } from './core/exception/entity-not-found.filter';
import { QueryFailedFilter } from './core/exception/query-failed.filter';
import { env } from './environment/env';
import session = require('express-session');
import morgan = require('morgan');

export async function initApp(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule);

  // if env.allowedHosts is not provided, no cors (no cross-domain). If provided, those specified hosts only are allowed.
  if (env.allowedHosts) {
    app.enableCors({ credentials: true, origin: env.allowedHosts });
  }
  // In development, a small lag is added artificially to simulate real-life network constraints.
  if (env.isDev && !env.isJest) {
    app.use((req, res, next) => setTimeout(next, appConfig.localhostLatency));
  }

  app.use(session({
    secret: env.secretKey,
    resave: false,
    saveUninitialized: false,
    // sameSite lax is required to make the OAuth2 work with state.
    cookie: { secure: !env.isDev, maxAge: appConfig.jwtLifeTime * 1000, sameSite: 'lax' },
  }));
  app.use(cookieParser(env.secretKey));
  // Log incoming requests with the specified format
  app.use(morgan('[:date[iso]] :remote-addr :method :url :status - :response-time ms'));
  // For validation, we may want to use a toolkit that works both on client-side and server-side
  // with a validation/data model format shared between the two apps.
  // It would replace nestjs' embedded validation (from class-validator).
  // Unless, with realtime, we skip client-side validation...
  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalFilters(new EntityNotFoundFilter());
  app.useGlobalFilters(new QueryFailedFilter());
  if (!env.isDev) {
    app.useGlobalGuards(new CsrfGuard());
  }
  return app;
}
