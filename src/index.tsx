import React from 'react';
import ReactDOM from 'react-dom';
import 'typeface-roboto';
import { unregister } from './_core/serviceWorker';
import App from './App';
import './index.css';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
unregister();
