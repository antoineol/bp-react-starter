import { renderTestAppSignedIn } from '../common/test/test.utils';

it('should display the home page by default and with / URL', async () => {
  mockGraphQL();
  const { getByText, queryByText, getByLabelText } = await renderTestAppSignedIn();
  // TODO should navigate to /profile
  // `/` URL renders the home page
  // store.dispatch(push('/'));
  // Alternatively: click a link to navigate:
  // leftClick(getByText(/go to page/i));

  // The home page is rendered by default
  // expect(getByText(/Add author/i)).toBeInTheDocument();
});

function mockGraphQL() {
}
