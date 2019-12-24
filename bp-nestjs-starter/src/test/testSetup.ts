import { _reqObj } from './test.utils';

afterAll(async () => (await _reqObj).app.close());
