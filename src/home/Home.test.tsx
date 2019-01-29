import { Button } from '@material-ui/core';
import { push } from 'connected-react-router';
import { ReactWrapper } from 'enzyme';
import React from 'react';
import { flushAllPromises, mockHttpGet, renderTestApp } from '../common/test.utils';
import Home, { Props } from './Home';

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
  mockHttpGet('https://jsonplaceholder.typicode.com/todos',
              [{ 'userId': 1, 'id': 1, 'title': 'delectus aut autem', 'completed': false }]);
  const { app } = renderTestApp();
  const home: ReactWrapper<Props> = app.find(Home);
  const countButton = home.find(Button).last();
  countButton.simulate('click');
  // app.update(); // Not required here
  await flushAllPromises();
  expect(home.find(Button).last().text()).toEqual('Fetch n°2');
});
