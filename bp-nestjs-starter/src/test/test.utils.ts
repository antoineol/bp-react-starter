import { INestApplication } from '@nestjs/common';
import { Test as NestTest, TestingModule } from '@nestjs/testing';
import * as supertest from 'supertest';
import { SuperTest, Test } from 'supertest';
import { AppModule } from '../app.module';

// tslint:disable-next-line:variable-name
export const _reqObj: Promise<RequestObj> = initTestApp(); // Exposed for testSetup only
const defaultRequestOptions: RequestOptions = {};
const defaultResponseExpectations = { status: 200 };

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
  const module: TestingModule = await NestTest.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = module.createNestApplication();
  await app.init();
  return { request: supertest(await app.getHttpServer()), app };
  // Attempt to use express app instance directly, which does not work well
  // return { request: supertest((await initApp()).getHttpServer()) };
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
    .expect('Content-Type', /json/)
    .expect(exp.status);
  return { req };
}
