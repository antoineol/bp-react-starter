import { Button, RadioGroup, Typography } from '@material-ui/core';
import axios, { AxiosRequestConfig } from 'axios';
import { push } from 'connected-react-router';
import { ReactWrapper } from 'enzyme';
import {
  compValue,
  flushAllPromises,
  mocked,
  renderTestApp,
  updateRadio,
} from '../common/test.utils';
import Home, { HomeComp, Props, State } from './Home';
import SecretArea, { SecretStatus } from './secret/SecretArea';

it('should display the home page by default and with / URL', async () => {
  const { app, store } = renderTestApp();
  const home: ReactWrapper<Props> = app.find(Home);
  expect(home).toHaveLength(1);
  expect(home.text()).toContain('save to reload');
  expect(home.find(Button)).toHaveLength(2);

  // / URL renders the home page
  store.dispatch(push('/'));
  app.update();
  expect(app.find(Home)).toHaveLength(1);

  // The button is initialized with count 1
  const countButton = app.find(Home).find(Button).last();
  expect(countButton.text()).toEqual('Fetch n°1');

  // The secret is hidden by default
  let secret = app.find(SecretArea);
  expect(secret).toHaveLength(1);
  expect(secret.text()).not.toContain('Voici le secret tant attendu !');

  // Clicking the radio button shows the secret
  // Recommended way to simulate a radio update:
  updateRadio(secret, 'secret', SecretStatus.Show);

  // alternative 1:
  // const secretComp = secret.find(SecretAreaComp).instance() as SecretAreaComp;
  // secretComp.handleChange({target: {value: SecretStatus.Show}} as any);

  // alternative 2:
  // store.dispatch({ type: SecretAT.Show, show: true } as ShowAction);

  app.update();
  // Need to re-fetch the components under app after the update, because they are immutable.
  // Previous references are outdated and won't give the right result with `compValue`,
  // .debug(), .html()...
  secret = app.find(SecretArea);
  // Check that the radio itself was updated
  expect(compValue(secret.find(SecretArea), RadioGroup, 'secret')).toEqual(SecretStatus.Show);
  // Then check that the secret area is displayed as expected
  expect(secret.find(Typography).last().text()).toContain('Voici le secret tant attendu !');
  // Just using `secret.text()` won't provide the full text because its parent tag is a Fragment,
  // which doesn't work well with `.text()`. So we use a more specific selector.
});

// Should be at top-level to be in the same scope as 'axios' module. It's a requirement
// from jest mock.
jest.mock('axios');

describe('Webservice interactions', () => {
  beforeEach(mockWebService);
  afterEach(() => jest.resetAllMocks());
  afterAll(() => jest.unmock('axios'));

  it('should increment the count by 1 when clicking its button', async () => {
    const expectedRequestParams = { id: 1 };
    const { app } = renderTestApp();
    const home: ReactWrapper<Props> = app.find(Home);
    const countButton = home.find(Button).last();
    countButton.simulate('click');
    await flushAllPromises();
    // app.update(); // Not required here

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/todos',
      { params: expectedRequestParams } as AxiosRequestConfig);
    expect(home.find(Button).last().text()).toEqual('Fetch n°2');
  });

  it('should update the count when inputting a number', async () => {
    const { app } = renderTestApp();
    const home: ReactWrapper<Props, State> = app.find(HomeComp);
    // HomeComp instead of Home to access its handleChange method

    // TODO (can be fixed by fetching a new home wrapper instance after app.update())
    // Ideally, we should simulate a 'change' event, but it doesn't trigger onChange - to fix
    // const countInput = home.find(TextField).first();
    // countInput.simulate('change', { target: { value: '12' } });

    const instance = home.instance() as HomeComp;
    instance.handleChange('count')({ target: { value: '12' } } as any);

    await flushAllPromises();
    // app.update(); // Not required here

    expect(axios.get).toHaveBeenCalledTimes(0);
    expect(home.find(Button).last().text()).toEqual('Fetch n°12');
  });

  it('should double the count when submitting the form (enter)', async () => {
    const { app } = renderTestApp({ counter: { count: { count: 12 } } });
    const home: ReactWrapper<Props, State> = app.find(Home);

    // Could also provide an initial value to the input field instead of initial store:
    // const instance = home.instance() as HomeComp;
    // instance.handleChange('count')({ target: { value: '12' } } as any);

    const form = home.find('form');
    expect(form).toHaveLength(1);
    form.simulate('submit');

    await flushAllPromises();
    // app.update(); // Not required here

    expect(axios.get).toHaveBeenCalledTimes(0);
    expect(home.find(Button).last().text()).toEqual('Fetch n°24');
  });
});

// TODO replace with an API mock util in test util - to copy from BMCE project (Crédit Immobilier)
function mockWebService(): void {
  const axiosMocked = mocked(axios);
  axiosMocked.get.mockResolvedValueOnce(
    { data: [{ 'userId': 1, 'id': 1, 'title': 'delectus aut autem', 'completed': false }] });
}
