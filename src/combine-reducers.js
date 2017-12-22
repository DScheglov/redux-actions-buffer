import { compose, combineReducers as reduxCombineReducers } from 'redux';
import { enableBatching, actionsBuffer } from './';

export const combineReducers = compose(
  enableBatching,
  reduxCombineReducers
);

export { actionsBuffer };