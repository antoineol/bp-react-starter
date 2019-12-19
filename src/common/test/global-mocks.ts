import { MySyncPromise } from './MySyncPromise';

// Usage: in src/setupTests.ts, to import before everything else.

// It's breaking a few tests, we will need to investigate what's wrong when promises become sync.
// Incomplete implementation? Side effects in the app where parts run in the wrong order?
global.Promise = MySyncPromise;

// As is, there is no performance improvement. Maybe because flushAllPromises() is still used?
// MySyncPromise allowed to remove a flushAllPromises() that was required otherwise, but other
// errors need to be fixed before generalizing the mock. Ideally, we should not use
// flushAllPromises() (each call costs ~0.5 second in tests).
// And using this mock should NOT make development harder. If it appears that the app needs
// test-specific adaptations, then it's a sign that this is not the way to go.
