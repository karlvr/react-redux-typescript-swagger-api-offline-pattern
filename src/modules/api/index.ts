import * as Api from 'typescript-fetch-api'

import { fetchTimeout } from './timeout'

/** The API configuration. */
let configuration: Api.Configuration | undefined
let api: Api.PetApi | undefined

export function initApiConfiguration(params: Api.ConfigurationParameters) {
	/** Optionally apply our fetch API wrapper to provide additional functionality */
	if (!params.fetchApi) {
		params.fetchApi = function(url: string, init?: {}): Promise<Response> {
			/* Apply a timeout to our requests. Note that the timeout doesn't cancel the request, it merely
			   throws an error so we are not left hanging.
			 */
			return fetchTimeout(url, init, 30000)
		}
	}

	configuration = new Api.Configuration(params)
	api = new Api.PetApi(configuration)
}

export function getConfiguration(): Api.Configuration {
	if (!configuration) {
		throw new Error('initApiConfiguration has not been called')
	}
	return configuration
}

/** A global API client. This API client should be used by the rest of the app to connect to the
 * API. It uses the global configuration, so it can pick up the required access token.
 */
export default function getApi(): Api.PetApi {
	if (!api) {
		throw new Error('initApiConfiguration has not been called')
	}
	return api
}
