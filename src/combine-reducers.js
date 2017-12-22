import { compose, combineReducers as reduxCombineReducers } from 'redux';
import { enableBatching, actionsBuffer, arrayToBatch } from './';

export const combineReducers = compose(
  enableBatching,
  reduxCombineReducers
);

export { actionsBuffer, arrayToBatch };