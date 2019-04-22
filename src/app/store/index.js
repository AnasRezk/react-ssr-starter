import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers';

const middleware = [];

if (process.env.NODE_ENV !== 'production') {
  const { createLogger } = require('redux-logger');
  const logger = createLogger({ collapsed: true });
  middleware.push(logger);
}

const store = createStore(reducers, {}, applyMiddleware(...middleware));

export default store;
