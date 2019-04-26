import { Button } from '@material-ui/core';
import { push } from 'connected-react-router';
import { ReactWrapper } from 'enzyme';
import React from 'react';
import { flushAllPromises, mockHttpGet, renderTestApp } from '../common/test.utils';
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

it('should increment the count by 1 when clicking its button', async () => {
  mockWebService();
  const { app } = renderTestApp();
  const home: ReactWrapper<Props> = app.find(Home);
  const countButton = home.find(Button).last();
  countButton.simulate('click');
  // app.update(); // Not required here
  await flushAllPromises();
  expect(home.find(Button).last().text()).toEqual('Fetch n°2');
});

it('should update the count when inputting a number', async () => {
  mockWebService();
  const { app } = renderTestApp();
  const home: ReactWrapper<Props, State> = app.find(HomeComp);

  // Ideally, we should simulate a 'change' event, but it doesn't trigger onChange - to fix
  // const countInput = home.find(TextField).first();
  // countInput.simulate('change', { target: { value: '12' } });

  const instance = home.instance() as HomeComp;
  instance.handleChange('count')({ target: { value: '12' } } as any);

  // app.update(); // Not required here?
  await flushAllPromises();

  expect(home.find(Button).last().text()).toEqual('Fetch n°12');
});

it('should double the count when submitting the form (enter)', async () => {
  mockWebService();
  const { app } = renderTestApp();
  const home: ReactWrapper<Props, State> = app.find(HomeComp);

  // Ideally, we should simulate a 'change' event, but it doesn't trigger onChange - to fix
  // const countInput = home.find(TextField).first();
  // countInput.simulate('change', { target: { value: '12' } });

  const instance = home.instance() as HomeComp;
  instance.handleChange('count')({ target: { value: '12' } } as any);
  instance.handleSubmit({
                          preventDefault: () => { /* do nothing */
                          },
                        } as any);

  // app.update(); // Not required here?
  await flushAllPromises();

  expect(home.find(Button).last().text()).toEqual('Fetch n°24');
});

function mockWebService(): void {
  mockHttpGet('https://jsonplaceholder.typicode.com/todos',
              [{ 'userId': 1, 'id': 1, 'title': 'delectus aut autem', 'completed': false }]);
}
