import { initApiConfiguration } from '../api'
import { createStore, compose, applyMiddleware, StoreEnhancer, Middleware, Store } from 'redux'
import { devToolsEnhancer } from 'redux-devtools-extension/logOnlyInProduction'
import createSagaMiddleware from 'redux-saga'
import { offline } from '@redux-offline/redux-offline'
import defaultOfflineConfig from '@redux-offline/redux-offline/lib/defaults'

import rootSaga from './sagas'
import { setAuthConfig } from '@modules/auth/index'
import platform from '@modules/platform/index'

import { readyAction } from './actions'
import { StoreState as RootStoreState, reducer } from './reducer'

export type RootStoreState = RootStoreState

/* API handling */
import { handleDiscard, handleEffect } from '@modules/api/offline'

export let store: Store<RootStoreState>

const PERSIST_KEY_PREFIX = 'react-redux-typescript-pattern'

export async function init(): Promise<void> {
	/**
	 * Create the redux-saga middleware.
	 */
	const sagaMiddleware = createSagaMiddleware()

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
			store.dispatch(readyAction())
		},

		persistOptions: {
			/* Don't persist the ready key, as we want to always set it when we dispatch the readyAction */
			blacklist: ['ready'],
			keyPrefix: PERSIST_KEY_PREFIX,
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

		/* The commented out function below hard-codes the app to function as if it is offline. */
		// detectNetwork: function(callback: (online: boolean) => void) {
		// 	callback(false)
		// },
	}

	let middlewares: Middleware[] = [sagaMiddleware]
	middlewares = platform.customiseReduxMiddleware(middlewares)

	/**
	 * Enhancers for the store.
	 */
	const enhancers = compose(
		/* Add the redux-offline store enhancer */
		offline(offlineConfig),
		/* Add the middlewares */
		applyMiddleware.apply(null, middlewares),
		/* Include the devtools. Comment this out if you don't want to use the dev tools. */
		devToolsEnhancer({}),
	) as StoreEnhancer<RootStoreState>

	/**
	 * Create the store. We do not include an initial state, as each of the module / duck
	 * reducers includes its own initial state.
	 */
	store = createStore(reducer, enhancers)

	/* Run the root saga */
	sagaMiddleware.run(rootSaga)

	/* Init the API */
	initApiConfiguration(platform.createApiConfigurationParams())

	/* Create the authentication config */
	setAuthConfig(platform.createAuthConfiguration())
}
