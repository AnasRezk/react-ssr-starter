import { combineReducers } from 'redux';
import layoutReducer from './layout-reducer';

const rootReducer = combineReducers({
  layout: layoutReducer
});

export default rootReducer;
