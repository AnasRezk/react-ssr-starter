import { createStore } from 'redux';
import reducers from '../../src/app/store/reducers';

export default () => {
  const store = createStore(reducers, {});

  return store;
};
