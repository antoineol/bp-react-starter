import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import * as rateLimit from 'express-rate-limit';
import * as expressSanitizer from 'express-sanitizer';
import * as helmet from 'helmet';
import { AppModule } from './app.module';
import { CsrfGuard } from './auth/csrf.guard';
import { appConfig } from './common/app.config';
import { UnknownExceptionFilter } from './core/exception/unknown-exception.filter';
import { env } from './environment/env';
import morgan = require('morgan');

export async function initApp(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule);
  // if env.allowedHosts is not provided, no cors (no cross-domain). If provided, those specified
  // hosts only are allowed.
  if (env.allowedHosts) {
    app.enableCors(
      { credentials: true, origin: env.allowedHosts.split(',').map(elt => elt.trim()) });
  }
  if (!env.isDev) {
    // Security, CSRF protection: all requests are expected to have a custom HTTP header.
    // This technique is presented here (does not require dynamic token):
    // https://owasp.org/www-project-cheat-sheets/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#use-of-custom-request-headers
    app.useGlobalGuards(new CsrfGuard());
  }
  // Security: various middleware (https://docs.nestjs.com/techniques/security)
  app.use(helmet());
  // Security: add rate limit
  app.use(rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 15, // limit each IP to 15 requests per windowMs
  }));
  app.use(morgan('[:date[iso]] :remote-addr :method :url :status - :response-time ms'));
  // In development, a small lag is added artificially to simulate real-life network constraints.
  if (env.isDev && !env.isJest) {
    app.use((req, res, next) => setTimeout(next, appConfig.localhostLatency));
  }

  app.use(cookieParser(env.secretKey));

  // Security (XSS): sanitize incoming requests (remove common injections)
  app.use(expressSanitizer());
  // Log incoming requests with the specified format
  // For validation, we may want to use a toolkit that works both on client-side and server-side
  // with a validation/data model format shared between the two apps.
  // It would replace nestjs' embedded validation (from class-validator).
  // Unless, with realtime, we skip client-side validation...
  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalFilters(new UnknownExceptionFilter());
  return app;
}
