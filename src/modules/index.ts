import { createStore, combineReducers, compose, applyMiddleware, StoreEnhancer } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension/logOnlyInProduction';
import { actionCreatorFactory } from 'typescript-fsa';
import createSagaMiddleware from 'redux-saga';
import { offline } from '@redux-offline/redux-offline';
import defaultOfflineConfig from '@redux-offline/redux-offline/lib/defaults';

import rootSaga from './sagas';
import * as auth from './auth/reducer';
import * as petstore from './petstore/reducer';
import { setConfig as setAuthConfig } from './auth/functions';

/* Import reducers from our modules */
import * as template from '../modules/template/reducer';
// import * as another from '../modules/another/reducers';

/* API handling */
import { handleDiscard, handleEffect } from './api/offline';

/**
 * The root store state. Include sub-states for all of the modules / ducks.
 * All of these should be annotated `readonly`, as should everything down
 * the tree of StoreState interfaces, and their contents.
 */
export interface RootStoreState {
    readonly template: template.StoreState;
    readonly auth: auth.StoreState;
    readonly petstore: petstore.StoreState;
}

/**
 * The root reducer, combines reducers for all of the modules / ducks.
 */
const reducer = combineReducers<RootStoreState>({
    template: template.reducer,
    auth: auth.reducer,
    petstore: petstore.reducer,
});

/**
 * Create the redux-saga middleware.
 */
const sagaMiddleware = createSagaMiddleware();

/** Action creator factory for root actions. */
const actionCreator = actionCreatorFactory();

/** Action dispatched when the app state is ready (has been rehydrated) */
export const readyAction = actionCreator('READY');

/**
 * Create the redux-offline configuration, based on the default configuration.
 */
const offlineConfig = {
    ...defaultOfflineConfig,

    /**
     * This callback occurs after redux-persist has rehydrated our Redux state.
     */
    persistCallback: () => {
        /* Let our app know that the application state has been rehydrated and is ready to be used. */
        store.dispatch(readyAction());
    },

    /**
     * This function is used to handle actions tagged for redux-offline to handle.
     */
    effect: handleEffect,
    
    /**
     * This function determines whether to discard a request, or to retry in, in the event
     * of an error.
     */
    discard: handleDiscard,
};

/**
 * Enhancers for the store.
 */
const enhancers = compose(
    /* Add the redux-offline store enhancer */
    offline(offlineConfig),
    /* Add the redux-saga middleware */
    applyMiddleware(sagaMiddleware),
    /* Include the devtools. Comment this out if you don't want to use the dev tools. */
    devToolsEnhancer({}),
) as StoreEnhancer<RootStoreState>;

/**
 * Create the store. We do not include an initial state, as each of the module / duck
 * reducers includes its own initial state.
 */
export const store = createStore<RootStoreState>(reducer, enhancers);

/* Run the root saga */
sagaMiddleware.run(rootSaga);

/* Create the authentication config */
setAuthConfig({
    apiBase: '/api',
    clientId: 'test',
    clientSecret: 'secret',
});
