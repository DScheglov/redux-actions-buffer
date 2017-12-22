import { createStore, applyMiddleware, compose } from 'redux';

import { combineReducers, actionsBuffer } from '../src/combine-reducers';
import { mainSuite } from './index.test';

const createAppStoreImpl = (reducers, initialState = {}) => createStore(
  combineReducers(reducers),
  initialState,
  applyMiddleware(actionsBuffer)
);

mainSuite('Implicitly applied High Ordered Reducer', createAppStoreImpl);