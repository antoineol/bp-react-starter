import { Logger } from '@nestjs/common';
import { Server } from 'http';
import { initApp } from './app';
import { generateTypes } from './common/utils/hasura-schema.utils';
import { env } from './environment/env';

const port = env.port;
const logger = new Logger('main');

async function bootstrap(): Promise<Server> {
  const app = await initApp();
  return app.listen(port);
}

bootstrap().then(() => {
  logger.log(`Serving the app at http://localhost:${port}`);
  if (env.isDev) {
    return generateTypes();
  }
// tslint:disable-next-line:no-console
}).catch(err => console.error('Error when starting API:', err));
