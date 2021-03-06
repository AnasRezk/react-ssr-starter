import path from 'path';
import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';
import responseTime from 'response-time';
import Loadable from 'react-loadable';
import createStore from './helpers/create-store';

import { renderApp } from './renderServerSideApp';

// This export is used by our initialization code in /scripts
export const app = express();
const { PUBLIC_URL = '' } = process.env;
const CENTER_BASE_NAME = 'center';
const Guest_BASE_NAME = 'guest';

app.use(compression());
app.use(helmet());

// Serve generated assets
app.use(
    PUBLIC_URL,
    express.static(path.resolve(__dirname, '../build'), {
        maxage: Infinity
    })
);

// Serve static assets in /public
app.use(
    PUBLIC_URL,
    express.static(path.resolve(__dirname, '../public'), {
        maxage: '30 days'
    })
);

app.use(morgan('tiny'));

app.use(
    responseTime((_req, res, time) => {
        res.setHeader('X-Response-Time', time.toFixed(2) + 'ms');
        res.setHeader('Server-Timing', `renderServerSideApp;dur=${time}`);
    })
);

// app.use(renderServerSideApp);

app.get('/center/', (req, res) => {
    Loadable.preloadAll().then(() => {
        const store = createStore();
        return renderApp(req, res, store, CENTER_BASE_NAME);
    });
});

app.get('/center/about', (req, res) => {
    Loadable.preloadAll().then(() => {
        const store = createStore();
        return renderApp(req, res, store, CENTER_BASE_NAME);
    });
});

// Root is Guest App
app.get('/', (req, res) => {
    Loadable.preloadAll().then(() => {
        const store = createStore();
        return renderApp(req, res, store, Guest_BASE_NAME);
    });
});
