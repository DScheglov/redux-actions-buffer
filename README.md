# redux-batch-buffer

Buffering redux-actions before dispatch them in the batch

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
import { createStore, applyMiddleware, compose } from 'redux';
import { combineReducers, actionsBuffer } from 'redux-batch-buffer/combine-reducers';


export const configureStore = (reducers, initialState = {}, middleweres) => createStore(
  combineReducers(reducers),
  initialState,
  applyMiddleware(...middleweres, actionsBuffer)
);
```

In case when it is not accaptable to use overrided `combineReduceres` you could
use *High Ordered Reducer* `enableBatching` is also provided by `redux-batch-buffer`:

```js
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { enableBatching, actionsBuffer } from 'redux-batch-buffer';


export const configureStore = (reducers, initialState = {}, middlewares) => createStore(
  enableBatching(combineReducers(reducer)),
  initialState,
  applyMiddleware(...middlewares, actionsBuffer)
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