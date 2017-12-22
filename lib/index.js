'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var START_BUFFER = 'RDX-ACTNS-BFFR::START';
var FLUSH_BUFFER = 'RDX-ACTNS-BFFR::FLUSH';
var DESTROY_BUFFER = 'RDX-ACTNS-BFFR::DESTROY';
var PROCESS_BATCH = 'RDX-ACTNS-BFFR::BATCH';

var startBuffering = exports.startBuffering = { type: START_BUFFER };
var flushBuffer = exports.flushBuffer = { type: FLUSH_BUFFER };
var destroyBuffer = exports.destroyBuffer = { type: DESTROY_BUFFER };
var batch = exports.batch = function batch(actions) {
  return { type: PROCESS_BATCH, actions: actions };
};

var enableBatching = exports.enableBatching = function enableBatching(reducer) {
  return function (state, action) {
    return action.type === PROCESS_BATCH ? action.actions.reduce(reducer, state) : reducer(state, action);
  };
};

var bufferDestroy = function bufferDestroy(bufferContainer) {
  return function (res) {
    return bufferContainer.buffer = null, res;
  };
};

var bufferFlush = function bufferFlush(bufferContainer) {
  return function (next) {
    return bufferContainer.buffer != null && bufferContainer.buffer.length > 0 && bufferDestroy(bufferContainer)(next(batch(bufferContainer.buffer)));
  };
};

var createBuffer = function createBuffer(bufferContainer) {
  return function (next) {
    return bufferFlush(bufferContainer)(next), bufferContainer.buffer = [];
  };
};

var processAction = function processAction(bufferContainer) {
  return function (next, action) {
    return bufferContainer.buffer ? bufferContainer.buffer.push(action) : Array.isArray(action) ? next(batch(action)) : next(action);
  };
};

var bufferManager = function bufferManager(bufferContainer) {
  return {
    create: createBuffer(bufferContainer),
    flush: bufferFlush(bufferContainer),
    destroy: bufferDestroy(bufferContainer),
    process: processAction(bufferContainer)
  };
};

var actionsBuffer = exports.actionsBuffer = function actionsBuffer(store) {
  var buffer = bufferManager({});
  return function (next) {
    return function (action) {
      return action.type === START_BUFFER ? buffer.create(next) : action.type === FLUSH_BUFFER ? buffer.flush(next) : action.type === DESTROY_BUFFER ? buffer.destroy(true) : buffer.process(next, action);
    };
  };
};