/** Platform specific implementations. */
import { Middleware } from 'redux'
import * as Api from 'typescript-fetch-api'

import { Config } from 'auth/types'
import { PlatformSupport } from '../index'
import { store } from 'root'

const platformSupportImplementation: PlatformSupport = {
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
			basePath: 'http://tomcat.dev.cactuslab.com/myhomecare/api/v0',
			accessToken: (name: string, scopes?: string[]): string => {
				let accessToken = store.getState().auth.accessToken
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
		}
	},
}

export default platformSupportImplementation
