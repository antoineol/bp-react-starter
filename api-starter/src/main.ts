import { Logger } from '@nestjs/common';
import { Server } from 'http';
import { initApp } from './app';
import { generateTypes, hasuraReloadMetadataAndSchema } from './common/utils/hasura-schema.utils';
import { env } from './environment/env';

const port = env.port;
const logger = new Logger('main');

async function bootstrap(): Promise<Server> {
  const app = await initApp();
  return app.listen(port);
}

bootstrap().then(async () => {
  logger.log(`The API is ready at http://localhost:${port} - Hasura types will be generated in the background.`);
  await hasuraReloadMetadataAndSchema();
  if (env.isDev) {
    // Ideally, generating types should happen directly on each change on Hasura, especially
    // if we use the same DB and hasura instance for multiple projects.
    // For now, let's say each project is responsible of generating its types.
    await generateTypes();
  }
  logger.log(`READY - The API is started and has completed all its Hasura tasks.`);
// tslint:disable-next-line:no-console
}).catch(err => console.error('Error when starting API:',
  err && err.response && err.response.data || err));
