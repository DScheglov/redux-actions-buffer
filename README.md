# redux-batch-buffer [![Build Status](https://travis-ci.org/DScheglov/redux-batch-buffer.svg?branch=master)](https://travis-ci.org/DScheglov/redux-batch-buffer) [![Coverage Status](https://coveralls.io/repos/github/DScheglov/redux-batch-buffer/badge.svg?branch=master)](https://coveralls.io/github/DScheglov/redux-batch-buffer?branch=master)

Buffering redux-actions before dispatch them in the batch.

`redux-batch-buffer` is a modular way to implement batching and buffering of redux actions.


## Installation

```shell
npm install --save redux-batch-buffer
```

```shell
yarn add redux-batch-buffer
```

## Usage

### Creating store:

The `redux-batch-buffer` provides own `combineReducers` to be used in order
to create a `redux`-store.

```js
import { createStore, applyMiddleware } from 'redux';
import { combineReducers, arrayToBatch, actionsBuffer } from 'redux-batch-buffer/combine-reducers';


export const configureStore = (reducers, initialState = {}, middleweres) => createStore(
  combineReducers(reducers),
  initialState,
  applyMiddleware(arrayToBatch, ...middleweres, actionsBuffer)
);
```

In case when it is not accaptable to use overrided `combineReduceres` you could
use *High Ordered Reducer* `enableBatching` is also provided by `redux-batch-buffer`:

```js
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { enableBatching, arrayToBatch, actionsBuffer } from 'redux-batch-buffer';


export const configureStore = (reducers, initialState = {}, middlewares) => createStore(
  enableBatching(combineReducers(reducer)),
  initialState,
  applyMiddleware(arrayToBatch, ...middlewares, actionsBuffer)
);
```

### Dispatching actions:

The `redux-batch-buffer` provides three ways to dispatch actions in a batch:
 - explicitly create a batching-action and then dispatch it
 - call dispatch with an array of actions (such practice could be incompatible
   with some middlewers)
 - `start buffering` actions before they will be ready for dispatching and then
   `flush buffer` in order to proceed with state changes.


#### Creating the action batch expicitly:

```js
import { batch } from 'redux-batch-buffer';

dispatch(batch([
  { type: 'FIRST' },
  { type: 'SECOND' },
  { type: 'THIRD' },
]));
```

or even in this way:

```js
import { batch } from 'redux-batch-buffer';

dispatch(batch(
  { type: 'FIRST' },
  { type: 'SECOND' },
  { type: 'THIRD' },
));
```

#### Dispatching an array of actions:

```js
dispatch([
  { type: 'FIRST' },
  { type: 'SECOND' },
  { type: 'THIRD' },
]);
```

#### Buffering the actions before batch dispatching:

```js
import { startBuffering, flushBuffer } from 'redux-batch-buffer';

dispatch(startBuffering);

dispatch({ type: 'FIRST' });
dispatch({ type: 'SECOND' });
dispatch({ type: 'THIRD' });

dispatch(flushBuffer);
```

Some cases could require to not proceed with changes:

```js
import { startBuffering, flushBuffer, destroyBuffer } from 'redux-batch-buffer';

dispatch(startBuffering);

dispatch({ type: 'FIRST' });
dispatch({ type: 'SECOND' });
dispatch({ type: 'THIRD' });

dispatch(isEverythingOk ? flushBuffer : destroyBuffer);
```

## Middleware composition

The `redux-batch-buffer` is a modular. It means that you could use only those things that
you need. 

1. **Batching**

   Just apply *High Ordered Reducer* `enableBatching` and then use `batch` function
   to create `batch`-action.

2. **Dispatching array of actions**

   Apply `enableBatching` and apply `arrayToBatch`-middleware as far from reducer as it is possible.

3. **Buffering**

   Apply `enableBatching` and `actionsBuffer`-middleware as close to reducers as it is possible.


### For example:

```js
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { arrayToBatch, actionsBuffer } from 'redux-batch-buffer';

export const appMiddlewares = [thunk, arrayToBatch, actionsBuffer, logger];
```
