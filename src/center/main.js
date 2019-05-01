import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import Loadable from 'react-loadable';
import store from '../app/store/index';
import App from './App';

Loadable.preloadReady().then(() => {
    ReactDOM.hydrate(
        <Provider store={store}>
            <BrowserRouter basename="center">
                <App />
            </BrowserRouter>
        </Provider>,
        document.getElementById('root')
    );
});
