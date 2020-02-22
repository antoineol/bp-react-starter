import { generate } from '@graphql-codegen/cli';
import { Logger } from '@nestjs/common';
import { config } from 'dotenv';
import fetchSchema from 'graphql-fetch-schema';
import * as mkdirp from 'mkdirp';
import { httpPost, wait } from './app.utils';

const rootHasuraUrl = 'http://localhost:8080/v1';

const root = `${__dirname}/../../../..`;
config({ path: `${root}/.env` });
const secret = process.env.HASURA_GRAPHQL_ADMIN_SECRET;
const apiSchemaName = 'api';
const generatedDir = `${root}/front-rocket/generated`;
const logger = new Logger('hasura.utils');

export async function generateTypes() {
  logger.log('Extract Hasura schema and types for front...');
  await withRetry(hasuraReloadMetadata);
  await withRetry(hasuraReloadRemoteSchema);
  await createGeneratedFolder();
  await hasuraExtractSchema();
  await generateTypesFromSchema();
  logger.log('Schema and types extracted.');
}

const connectionFailedErrorExtract = 'connect ECONNREFUSED';
const retryDelay = 3;

async function withRetry<T>(func: (...args: any[]) => Promise<T>) {
  try {
    return await func();
  } catch (e) {
    if (e && e.message && (e.message as string).includes(connectionFailedErrorExtract)) {
      logger.error(
        `Couldn't connect to Hasura. Is Hasura container started? Will retry in ${retryDelay} seconds...`);
      await wait(retryDelay * 1000);
      return await withRetry(func);
    } else {
      throw e;
    }
  }
}

async function hasuraReloadMetadata(name = apiSchemaName) {
  return httpPost(`${rootHasuraUrl}/query`, {
    'type': 'reload_metadata',
    'args': {},
  }, {
    headers: {
      'X-Hasura-Role': 'admin',
      'X-Hasura-Admin-Secret': secret,
    },
  });
}

async function hasuraReloadRemoteSchema(name = apiSchemaName) {
  return httpPost(`${rootHasuraUrl}/query`, {
    'type': 'reload_remote_schema',
    'args': {
      'name': 'api',
    },
  }, {
    headers: {
      'X-Hasura-Role': 'admin',
      'X-Hasura-Admin-Secret': secret,
    },
  });
}

async function createGeneratedFolder() {
  return (mkdirp as any)(generatedDir);
}

async function hasuraExtractSchema() {
  return fetchSchema(`${rootHasuraUrl}/graphql`, {
    json: false,
    graphql: true,
    outputPath: generatedDir,
    headers: {
      'X-Hasura-Role': 'admin',
      'X-Hasura-Admin-Secret': secret,
    },
  });
}

async function generateTypesFromSchema() {
  return generate(
    {
      schema: `${generatedDir}/schema.graphql`,
      // documents: './src/**/*.graphql',
      generates: {
        [`${generatedDir}/schema.d.ts`]: {
          plugins: ['typescript'],
        },
      },
      silent: true,
    },
    true,
  );
}
