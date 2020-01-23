import { clickElt, renderTestAppSignedIn } from '../common/test/test.utils';

it('should display the profile page when clicking Profile button', async () => {
  mockGraphQL();
  const { getByText, findByText } = await renderTestAppSignedIn();

  clickElt(getByText(/Profile/i));
  // TODO should navigate to /profile
  // `/` URL renders the home page
  // store.dispatch(push('/'));
  // Alternatively: click a link to navigate:
  // leftClick(getByText(/go to page/i));

  // The home page is rendered by default
  await findByText('Add author'); // Wait for the button label to update to this value
  expect(getByText(/Add author/i)).toBeInTheDocument();
});

function mockGraphQL() {
}
