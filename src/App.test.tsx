import { createBrowserHistory } from 'history';
import React from 'react';
import App, { Props } from './App';
import { shallowMui } from './common/test.utils';

it('renders without crashing', () => {
  const component = shallowMui<Props>(<App history={createBrowserHistory()} />);
  expect(component).toMatchSnapshot();
});
