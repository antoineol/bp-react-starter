import { Logger } from '@nestjs/common';
import { Server } from 'http';
import { initApp } from './app';
import { env } from './environment/env';

const port = env.port;
const logger = new Logger('main');

async function bootstrap(): Promise<Server> {
  const app = await initApp();
  return app.listen(port);
}

bootstrap().then(() => {
  if (!env.isProduction) {
    logger.log(`Serving the app at http://localhost:${port}`);
  }
}).catch(err => logger.error(err));
