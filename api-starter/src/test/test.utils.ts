import { INestApplication, Logger } from '@nestjs/common';
import { Test as NestTest, TestingModule } from '@nestjs/testing';
import { Client } from 'pg';
import * as supertest from 'supertest';
import { SuperTest, Test } from 'supertest';
import { AppModule } from '../app.module';
import { env } from '../environment/env';

// tslint:disable-next-line:variable-name
export const _reqObj: Promise<RequestObj> = initTestApp(); // Exposed for testSetup only
const defaultRequestOptions: RequestOptions = {};
const defaultResponseExpectations = { status: 200 };
const logger = new Logger('test.utils');

export interface RequestOptions {
  headers?: { [key: string]: string };
}

export interface ResponseExpectations {
  status?: number;
}

export async function testGet(url: string,
                              responseExpectations?: ResponseExpectations,
                              requestOptions?: RequestOptions,
): Promise<{ req: Test }> {
  return testReq('get', url, undefined, responseExpectations, requestOptions);
}

export async function testPost(url: string, body: any,
                               responseExpectations?: ResponseExpectations,
                               requestOptions?: RequestOptions,
): Promise<{ req: Test }> {
  return testReq('post', url, body, responseExpectations, requestOptions);
}

interface RequestObj {
  request: SuperTest<Test>;
  app: INestApplication;
}

async function initTestApp(): Promise<RequestObj> {
  process.env.TYPEORM_URL = env.typeOrmTestUrl;
  await createDb();

  const module: TestingModule = await NestTest.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = module.createNestApplication();
  await app.init();
  return { request: supertest(await app.getHttpServer()), app };

  // Attempt to use express app instance directly, which does not work well (controllers are not bound).
  // const app = await initApp();
  // await new Promise(resolve => setTimeout(resolve, 10000));
  // return { request: supertest(app.getHttpServer()), app };
}

async function testReq(method: string, url: string, body: any,
                       responseExpectations?: ResponseExpectations,
                       requestOptions?: RequestOptions,
): Promise<{ req: Test }> {
  const exp = { ...defaultResponseExpectations, ...responseExpectations };
  const opt = { ...defaultRequestOptions, ...requestOptions };
  const { request } = await _reqObj;
  let req = request[method](url);
  if (opt.headers) {
    req = req.set(opt.headers);
  }
  if (body) {
    req = req.send(body);
  }
  req = req
    .expect(exp.status)
    .expect('Content-Type', /json/);
  return { req };
}

async function createDb() {
  try {
    // Uses the default database to create the app database
    const connectionString = env.typeOrmUrl;
    const client = new Client({
      connectionString,
    });
    await client.connect();
    try {
      await client.query(`CREATE DATABASE ${env.typeOrmTestUrl.substr(env.typeOrmTestUrl.lastIndexOf('/') + 1)}`);
    } catch (err) {
      // tslint:disable-next-line:no-bitwise
      if (err && !~err.message.indexOf('already exists')) {
        throw err;
      }
    }
    await client.end();
  } catch (e) {
    if (e && e.message && e.message.includes('ECONNREFUSED')) {
      throw new Error(`Could not connect to the database. It is probably not started or the connection string \
is wrong in \`TYPEORM_URL\` environment variable. Error: ${e.message}`);
    }
    logger.error('An error occurred when creating the database:', e);
    throw e;
  }
}
