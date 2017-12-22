import { createStore, combineReducers, applyMiddleware, compose } from 'redux';

import {
  enableBatching,
  batch,
  startBuffering,
  destroyBuffer,
  flushBuffer,
  actionsBuffer
} from '../src';


const createAppStoreExpl = (reducers, initialState = {}) => createStore(
  enableBatching(combineReducers(reducers)),
  initialState,
  applyMiddleware(actionsBuffer)
);

const allActions = (state = [], action) => [...state, action];
const lastActionType = (state = '', action) => action.type;

export const mainSuite = (prefix, createAppStore) => describe(prefix, () => {
  test('creating a store', () => {
    const store = createAppStore({ allActions });
    expect(store.dispatch).toBeInstanceOf(Function);
    expect(store.getState).toBeInstanceOf(Function);
    expect(store.replaceReducer).toBeInstanceOf(Function);
    expect(store.getState()).toMatchSnapshot();
  });

  test('created store should process actions one by the one', () => {
    const store = createAppStore({ lastActionType });
    const subscriber = jest.fn();
    store.subscribe(subscriber);
    store.dispatch({ type: 'FIRST' });
    store.dispatch({ type: 'SECOND' });
    store.dispatch({ type: 'THIRD' });
    expect(store.getState()).toEqual({ lastActionType: 'THIRD' });
    expect(subscriber.mock.calls.length).toBe(3);
  });

  test('created store should process the explicit batch of actions', () => {
    const store = createAppStore({ lastActionType });
    const subscriber = jest.fn();
    store.subscribe(subscriber);
    store.dispatch(batch([
      { type: 'FIRST' },
      { type: 'SECOND' },
      { type: 'THIRD' },
    ]));
    expect(store.getState()).toEqual({ lastActionType: 'THIRD' });
    expect(subscriber.mock.calls.length).toBe(1);
  });

  test('created store should process the implicit batch of actions', () => {
    const store = createAppStore({ lastActionType });
    const subscriber = jest.fn();
    store.subscribe(subscriber);
    store.dispatch([
      { type: 'FIRST' },
      { type: 'SECOND' },
      { type: 'THIRD' },
    ]);
    expect(store.getState()).toEqual({ lastActionType: 'THIRD' });
    expect(subscriber.mock.calls.length).toBe(1);
  });

  test('created store should bufferize actions and then process the batch', () => {
    const store = createAppStore({ lastActionType });
    const subscriber = jest.fn();
    store.subscribe(subscriber);
    const buffer = store.dispatch(startBuffering);
    store.dispatch({ type: 'FIRST' });
    store.dispatch({ type: 'SECOND' });
    store.dispatch({ type: 'THIRD' });
    expect(buffer).toEqual([
      { type: 'FIRST' },
      { type: 'SECOND' },
      { type: 'THIRD' },
    ]);
    store.dispatch(flushBuffer);
    expect(store.getState()).toEqual({ lastActionType: 'THIRD' });
    expect(subscriber.mock.calls.length).toBe(1);
  });

  test('created store should bufferize actions and then process the batch', () => {
    const store = createAppStore({ lastActionType });
    const subscriber = jest.fn();
    store.subscribe(subscriber);
    const buffer = store.dispatch(startBuffering);
    store.dispatch({ type: 'FIRST' });
    store.dispatch({ type: 'SECOND' });
    store.dispatch({ type: 'THIRD' });
    expect(buffer).toEqual([
      { type: 'FIRST' },
      { type: 'SECOND' },
      { type: 'THIRD' },
    ]);
    store.dispatch(destroyBuffer);
    expect(store.getState()).toMatchSnapshot();
    expect(subscriber.mock.calls.length).toBe(0);
  });
});

mainSuite('Explicitly applied High Ordered Reducer', createAppStoreExpl);