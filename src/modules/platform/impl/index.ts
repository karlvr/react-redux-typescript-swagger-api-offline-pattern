/** Platform specific implementations. */
import { Middleware, Store } from 'redux'
import * as Api from 'typescript-fetch-api'

import { Config } from 'modules/auth/types'
import { PlatformSupport } from '../index'
import { refreshedToken, refreshTokenFailed } from 'modules/auth/actions'
import { getAuthConfig } from 'modules/auth'
import { RootStoreState } from 'modules/root'

let _store: Store<RootStoreState>

const platformSupportImplementation: PlatformSupport = {

	init: (store) => {
		_store = store
	},

	/** Customise the Redux middleware for this platform */
	customiseReduxMiddleware: (middlewares: Middleware[]): Middleware[] => {
		return middlewares
	},

	customiseRootReducer: (reducer) => {
		return reducer
	},

	customiseReducers: (reducers) => {
		return reducers
	},

	confirm: (message: string, title: string, confirmAction: string): Promise<boolean> => {
		const result = window.confirm(message)
		return Promise.resolve(result)
	},

	createApiConfigurationParams: (): Api.ConfigurationParameters => {
		return {
			// basePath: 'http://example.com/api/v0',
			accessToken: (name: string, scopes?: string[]): string => {
				const accessToken = getAuthConfig().accessToken()
				if (accessToken) {
					return accessToken.access_token
				} else {
					// TODO the generated API doesn't support not returning a valid access token
					// We send a string, rather than nothing, so the server responds with a 401 rather
					// than a 403. A 401 signals that we need to authenticate, so the rest of our code
					// handles the failure appropriately. See handleDiscard.
					return 'INVALID'
				}
			},
		}
	},

	createAuthConfiguration: (): Config => {
		return {
			tokenEndpoint: 'http://example.com/oauth/token',
			clientId: 'test',
			clientSecret: 'secret',
			accessToken: () => _store.getState().auth.accessToken,
			refreshedAccessToken: (accessToken) => _store.dispatch(refreshedToken(accessToken)),
			refreshAccessTokenFailed: () => _store.dispatch(refreshTokenFailed(Date.now())),
		}
	},
}

export default platformSupportImplementation
