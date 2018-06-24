/** Platform specific implementations. */
import { Middleware, ReducersMapObject } from 'redux'

import { Config } from 'auth/types'
import { PlatformSupport } from '../index'

const platformSupportImplementation: PlatformSupport = {
	/** Customise the Redux middleware for this platform */
	customiseReduxMiddleware: (middlewares: Middleware[]): Middleware[] => {
		return middlewares
	},

	customiseReducers: (reducers: ReducersMapObject): ReducersMapObject => {
		return reducers
	},

	confirm: (message: string, title: string, confirmAction: string): Promise<boolean> => {
		const result = window.confirm(message)
		return Promise.resolve(result)
	},

	createAuthConfiguration: (): Config => {
		return {
			clientId: 'test',
			clientSecret: 'secret',
		}
	},
}

export default platformSupportImplementation
