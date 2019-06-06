import { MySyncPromise } from './MySyncPromise';

it('can use my promise', () => {
  let resolveFn: any;

// creating a new promis
  const promise = new MySyncPromise((resolve, reject) => {
    // assigning the resolve function a variable from outter scope
    resolveFn = resolve;
    // console.log('1. Promise is ready');
  });

// attaching a `then` handler
  promise.then(() => {
    // console.log('3. Promise is resolved');
  });

// resolving the promise right away
//   console.log('2. Will resolve the promise');
  resolveFn();

  // console.log('4. Last line of code');
});

it('can chain promises 1', async () => {
  const p = (MySyncPromise.resolve(42).then(val => {
    // console.log('1.');
    return 63;
  }) as any);
  // console.log('2.');
  const res = await p;
  // console.log('3.');
  expect(res).toEqual(63);
});

function fakeAsyncFunction() {
  const p = (MySyncPromise.resolve(42).then(val => {
    // console.log('1.');
    return 63;
  }) as any);
  // console.log('2.');
  return p;
}

it('can chain promises 2', () => {
  fakeAsyncFunction().then((res: any) => {
    // console.log('3.');
    expect(res).toEqual(63);
  });
  // console.log('4.');
});
