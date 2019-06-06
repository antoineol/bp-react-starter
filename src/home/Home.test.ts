import { Button, Typography } from '@material-ui/core';
import { AxiosRequestConfig } from 'axios';
import { push } from 'connected-react-router';
import { ReactWrapper } from 'enzyme';
import { defaultOptions } from '../common/app.utils';
import {
  compValue,
  flushAllPromises,
  mockApiGet,
  renderTestApp,
  updateInput,
  updateRadio,
} from '../common/test.utils';
import { TodoItem } from './count.service';
import Home, { Props, State } from './Home';
import SecretArea, { SecretStatus } from './secret/SecretArea';

it('should display the home page by default and with / URL', async () => {
  const { app, store } = await renderTestApp();

  // `/` URL renders the home page
  store.dispatch(push('/'));
  // Use `app.update()` when the app needs to be re-rendered
  expect(app.find(Home)).toHaveLength(1);

  // The button is initialized with count 1
  const countButton = app.find(Home).find(Button).last();
  expect(countButton.text()).toEqual('Fetch n°1');

  // The secret is hidden by default
  let secret = app.find(SecretArea);
  expect(secret).toHaveLength(1);
  expect(secret.text()).not.toContain('Voici le secret tant attendu !');

  // Clicking the radio button shows the secret. Set 'secret' radio to 'Show'.
  updateRadio(secret, 'secret', SecretStatus.Show);

  // Sometimes, we need to re-fetch the components under app after they were updated.
  // Previous references are outdated and may not give the right result with `compValue()`,
  // .debug(), .html()...
  secret = app.find(SecretArea);

  // Check that the radio itself was updated.
  // We should normally use RadioGroup reference directly, instead of 'RadioGroup', but it seems
  // that this component does not implement correctly RadioGroup.displayName nor RadioGroup.name
  // (both undefined). So we provide the string ourselves.
  // For our own components, we won't have the issue:
  // - for class components (displayName is added automatically by React)
  // - for functional components, if you use named functions instead of lambda functions. Otherwise
  // you need to bind the displayName manually to exported component when declaring it.
  expect(compValue(secret, 'RadioGroup', 'secret')).toEqual(SecretStatus.Show);
  // Then check that the secret area is displayed as expected
  expect(secret.find(Typography).last().text()).toContain('Voici le secret tant attendu !');
  // Just using `secret.text()` won't provide the full text because its parent tag is a Fragment,
  // which doesn't work well with `.text()`. So we use a more specific selector.
  // Components can also be found using getCompByName() in a bigger tree.
});

describe('Webservice interactions', () => {

  it('should increment the count by 1 when clicking its button', async () => {
    const apiMock = mockWebservice(); // Mock HTTP requests
    const expectedRequestParams = { id: 1 };
    const { app } = await renderTestApp();
    const home: ReactWrapper<Props> = app.find(Home);
    const countButton = home.find(Button).last();
    countButton.simulate('click');

    // An HTTP request is simulated (and mocked), which is not synchronous here, although axios
    // is mocked. To wait for the next async round (which is enough in most cases for tests with
    // mocks), we call this utility.
    await flushAllPromises();

    expect(apiMock).toHaveBeenCalledTimes(1);
    expect(apiMock).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/todos',
      { ...defaultOptions, params: expectedRequestParams } as AxiosRequestConfig);
    expect(home.find(Button).last().text()).toEqual('Fetch n°2');
  });

  it('should double the count when submitting the form (enter)', async () => {
    const apiMock = mockWebservice();
    const { app } = await renderTestApp();
    const home: ReactWrapper<Props, State> = app.find(Home);

    // Fill input with count 12
    updateInput(home, 'count', '12');
    expect(home.find(Button).last().text()).toEqual('Fetch n°12');

    // Submit form (Enter)
    home.find('form').simulate('submit');

    // Check that no API call was done and the count has doubled.
    expect(apiMock).toHaveBeenCalledTimes(0);
    expect(home.find(Button).last().text()).toEqual('Fetch n°24');
  });
});

function mockWebservice() {
  return mockApiGet(() => [{ 'id': 1, 'title': 'delectus aut autem' } as TodoItem]);
}
