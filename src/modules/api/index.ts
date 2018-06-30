import * as Api from 'typescript-fetch-api'

import { fetchTimeout } from './timeout'

export type ApiErrorTransformer = (response: Response) => Error

/** The API configuration. */
let configuration: Api.Configuration | undefined
let api: Api.PetApi | undefined
let errorTransformer: ApiErrorTransformer | undefined

/** Our fetch API wrapper to provide additional functionality */
const myFetchAPI: Api.FetchAPI = function(url: string, init?: {}): Promise<Response> {
	/* Apply a timeout to our requests. Note that the timeout doesn't cancel the request, it merely
	   throws an error so we are not left hanging.
	 */
	return fetchTimeout(url, init, 30000)
}

export function initApiConfiguration(params: Api.ConfigurationParameters) {
	configuration = new Api.Configuration(params)

	api = new Api.PetApi(configuration, undefined, myFetchAPI)
}

export function getConfiguration(): Api.Configuration {
	return configuration!
}

export function getErrorTransformer(): ApiErrorTransformer | undefined {
	return errorTransformer
}

/** Set a function to be used to transform failed Response objects into Errors. */
export function setErrorTransformer(e?: ApiErrorTransformer) {
	errorTransformer = e
}

/** A global API client. This API client should be used by the rest of the app to connect to the
 * API. It uses the global configuration, so it can pick up the required access token.
 */
export default function getApi(): Api.PetApi {
	return api!
}
