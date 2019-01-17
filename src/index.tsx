import { createBrowserHistory, History } from 'history';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import 'typeface-roboto';
import { configureStore } from './_core/app.store';
import { unregister } from './_core/serviceWorker';
import App from './App';
import './index.css';

const history: History = createBrowserHistory();

const store = configureStore({}, history);

// Init the app. For testing, we use <App /> directly.
ReactDOM.render(<Provider store={store}>
  <App history={history} />
</Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
unregister();
