import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router-dom';
import Helmet from 'react-helmet';
import Loadable from 'react-loadable';
import { getBundles } from 'react-loadable/webpack';

import CenterApp from '../src/center/App';
import GuestApp from '../src/guest/app';
// import configureStore from '../src/utils/configureStore';
// import { fetchDataForRender } from './fetchDataForRender';
import { indexHtml } from './indexHtml';
import stats from '../build/react-loadable.json';
// import createStore from './helpers/create-store';

// export const renderServerSideApp = (req, res) => {
//   // const store = configureStore(undefined, { logger: false });
//   const store = createStore();

//   Loadable.preloadAll()
//     .then(() => fetchDataForRender(req, store))
//     .then(() => renderApp(req, res, store));
// };

export const renderApp = (req, res, store, basename) => {
    const context = {};
    const modules = [];
    const markup = ReactDOMServer.renderToString(
        <Loadable.Capture report={moduleName => modules.push(moduleName)}>
            <Provider store={store}>
                <StaticRouter basename={basename !== 'guest' ? basename : ''} location={req.url} context={context}>
                    {basename === 'center' ? <CenterApp /> : <GuestApp />}
                </StaticRouter>
            </Provider>
        </Loadable.Capture>
    );

    if (context.url) {
        res.redirect(context.url);
    } else {
        const fullMarkup = indexHtml({
            helmet: Helmet.renderStatic(),
            initialState: store.getState(),
            bundles: getBundles(stats, modules),
            markup,
            basename
        });

        res.status(200).send(fullMarkup);
    }
};
