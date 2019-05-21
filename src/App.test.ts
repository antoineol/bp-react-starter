import { Button } from '@material-ui/core';
import { ReactWrapper } from 'enzyme';
import { Props } from './App';
import { renderTestApp } from './common/test.utils';
import Home from './home/Home';

it('renders without crashing', async () => {
  // Tests are mainly functional: they should cover all app features as we would test them manually.
  // More test samples in src/home/Home.test.ts.
  const { app } = await renderTestApp();
  const home: ReactWrapper<Props> = app.find(Home);
  expect(home).toHaveLength(1);
  expect(home.text()).toContain('save to reload');
  expect(home.find(Button)).toHaveLength(2);
});
