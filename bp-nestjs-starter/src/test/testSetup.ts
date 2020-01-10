import { _reqObj } from './test.utils';

beforeAll(() => _reqObj);
afterAll(async () => (await _reqObj).app.close());
