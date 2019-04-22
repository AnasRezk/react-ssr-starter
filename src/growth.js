import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import Loadable from 'react-loadable';
import store from './app/store/index';
import GrowthApp from './growth/app';

import './styles/index.scss';

Loadable.preloadReady().then(() => {
    ReactDOM.hydrate(
        <Provider store={store}>
            <BrowserRouter basename="growth">
                <GrowthApp />
            </BrowserRouter>
        </Provider>,
        document.getElementById('root')
    );
});
