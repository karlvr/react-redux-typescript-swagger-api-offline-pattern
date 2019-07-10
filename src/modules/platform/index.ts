import { Middleware, ReducersMapObject, Reducer, Action } from 'redux'
import * as Api from 'typescript-fetch-api'

import { Config } from 'modules/auth/types'
import platformSupportImplementation from './impl'
import { RootStoreState } from 'modules/root'

export interface PlatformSupport {
	customiseReduxMiddleware: (middlewares: Middleware[]) => Middleware[]

	customiseRootReducer: (reducer: Reducer<RootStoreState>) => Reducer<RootStoreState>

	customiseReducers: <S, A extends Action>(reducers: ReducersMapObject<S, A>) => ReducersMapObject<S, A>

	/** Display a message to the user, asking them to confirm the given message. */
	confirm(message: string, title: string, confirmAction: string): Promise<boolean>

	/** Create and return the API configuration parameters */
	createApiConfigurationParams(): Api.ConfigurationParameters

	/** Create and return the authentication configuration */
	createAuthConfiguration(): Config
}

export default platformSupportImplementation
