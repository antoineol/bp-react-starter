import { createBrowserHistory } from 'history';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App history={createBrowserHistory()} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
