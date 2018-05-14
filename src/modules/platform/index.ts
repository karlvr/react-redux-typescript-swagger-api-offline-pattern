import { Middleware, ReducersMapObject } from 'redux'

import { Config } from '../auth/types'
import platformSupportImplementation from './impl'

export interface PlatformSupport {
	customiseReduxMiddleware: (middlewares: Middleware[]) => Middleware[]

	customiseReducers: (reducers: ReducersMapObject) => ReducersMapObject

	/** Display a message to the user, asking them to confirm the given message. */
	confirm(message: string, title: string, confirmAction: string): Promise<boolean>

	/* Create and return the authentication configuration */
	createAuthConfiguration(): Config
}

export default platformSupportImplementation
