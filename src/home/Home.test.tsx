import { Button } from '@material-ui/core';
import axios, { AxiosRequestConfig } from 'axios';
import { push } from 'connected-react-router';
import { ReactWrapper } from 'enzyme';
import React from 'react';
import { flushAllPromises, mocked, renderTestApp } from '../common/test.utils';
import Home, { HomeComp, Props, State } from './Home';

it('should display the home page by default', async () => {
  const { app } = renderTestApp();
  const home: ReactWrapper<Props> = app.find(Home);
  expect(home).toHaveLength(1);
  expect(home.text()).toContain('save to reload');
  expect(home.find(Button)).toHaveLength(2);
});

it('should stay on the home page if pushing / URL', async () => {
  const { app, store } = renderTestApp();
  store.dispatch(push('/'));
  app.update();
  expect(app.find(Home)).toHaveLength(1);
});

it('should initialize the button with count 1', async () => {
  const { app } = renderTestApp();
  const countButton = app.find(Home).find(Button).last();
  expect(countButton.text()).toEqual('Fetch n°1');
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
    // app.update(); // Not required here
    await flushAllPromises();

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/todos',
                                           { params: expectedRequestParams } as AxiosRequestConfig);
    expect(home.find(Button).last().text()).toEqual('Fetch n°2');
  });

  it('should update the count when inputting a number', async () => {
    const { app } = renderTestApp();
    const home: ReactWrapper<Props, State> = app.find(HomeComp);
    // HomeComp instead of Home to access its handleChange method

    // Ideally, we should simulate a 'change' event, but it doesn't trigger onChange - to fix
    // const countInput = home.find(TextField).first();
    // countInput.simulate('change', { target: { value: '12' } });

    const instance = home.instance() as HomeComp;
    instance.handleChange('count')({ target: { value: '12' } } as any);

    // app.update(); // Not required here
    await flushAllPromises();

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

    // app.update(); // Not required here
    await flushAllPromises();

    expect(axios.get).toHaveBeenCalledTimes(0);
    expect(home.find(Button).last().text()).toEqual('Fetch n°24');
  });
});

function mockWebService(): void {
  const axiosMocked = mocked(axios);
  axiosMocked.get.mockResolvedValueOnce(
    { data: [{ 'userId': 1, 'id': 1, 'title': 'delectus aut autem', 'completed': false }] });
}
