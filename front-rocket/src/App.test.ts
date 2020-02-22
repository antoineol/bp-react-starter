import { renderTestAppSignedIn } from './test/test.utils';

it('renders without crashing', async () => {
  // Tests are mainly functional: they should cover all app features as we would test them
  // manually. More test samples in src/home/Home.test.ts.
  const { getByText, getAllByRole } = await renderTestAppSignedIn();
  expect(getByText(/save to reload/i)).toBeInTheDocument();
  expect(getAllByRole('button')).toHaveLength(2); // Sign out and Fetch
});
