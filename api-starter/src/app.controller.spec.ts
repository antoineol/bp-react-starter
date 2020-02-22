import { testGet } from './test/test.utils';

describe('AppController', () => {
  it('/ should return isAlive', async () => {
    const { req } = await testGet('/');
    return req
      .expect(200)
      .expect({ isAlive: true });
  });
});
