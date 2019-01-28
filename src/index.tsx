import React from 'react';
import ReactDOM from 'react-dom';
import 'typeface-roboto';
import { unregister } from './_core/serviceWorker';
import { makeApp } from './App';
import './index.css';

// Init the app.
const { app } = makeApp({});
ReactDOM.render(app, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
unregister();
