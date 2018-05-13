import { createStore, compose, applyMiddleware, StoreEnhancer } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension/logOnlyInProduction';
import createSagaMiddleware from 'redux-saga';
import { offline } from '@redux-offline/redux-offline';
import defaultOfflineConfig from '@redux-offline/redux-offline/lib/defaults';

import rootSaga from './sagas';
import { setConfig as setAuthConfig } from './auth/functions';
import { readyAction } from './root/actions';
import { StoreState as RootStoreState, reducer } from './root/reducer';

export type RootStoreState = RootStoreState;

/* API handling */
import { handleDiscard, handleEffect } from './api/offline';

/**
 * Create the redux-saga middleware.
 */
const sagaMiddleware = createSagaMiddleware();

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
