import * as Api from 'typescript-fetch-api'

import { fetchTimeout } from './timeout'
import { prepareConfigurationForAuth } from 'auth/index'

/** The API configuration. */
export const configuration = new Api.Configuration({
	// basePath: '',
})
prepareConfigurationForAuth(configuration)

/** Our fetch API wrapper to provide additional functionality */
let myFetchAPI: Api.FetchAPI = function(url: string, init?: {}): Promise<Response> {
	/* Apply a timeout to our requests. Note that the timeout doesn't cancel the request, it merely
	   throws an error so we are not left hanging.
	 */
	return fetchTimeout(url, init, 30000)
}

/** A global API client. This API client should be used by the rest of the app to connect to the
 * API. It uses the global configuration, so it can pick up the required access token.
 */
export const api = new Api.PetApi(configuration, undefined, myFetchAPI)
export default api
