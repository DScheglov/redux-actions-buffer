'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.actionsBuffer = exports.combineReducers = undefined;

var _redux = require('redux');

var _ = require('./');

var combineReducers = exports.combineReducers = (0, _redux.compose)(_.enableBatching, _redux.combineReducers);

exports.actionsBuffer = _.actionsBuffer;