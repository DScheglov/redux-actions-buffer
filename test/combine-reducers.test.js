import { createStore, applyMiddleware, compose } from 'redux';

import { combineReducers, actionsBuffer, arrayToBatch } from '../src/combine-reducers';
import { mainSuite } from './index.test';

const createAppStoreImpl = (reducers, initialState = {}) => createStore(
  combineReducers(reducers),
  initialState,
  applyMiddleware(arrayToBatch, actionsBuffer)
);

mainSuite('Implicitly applied High Ordered Reducer', createAppStoreImpl);