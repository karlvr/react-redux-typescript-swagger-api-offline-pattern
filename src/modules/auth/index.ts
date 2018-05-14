import * as Api from 'typescript-fetch-api'
import { Config } from './types'

/** The authentication module config, with default values.
 * Use the setConfig method to update the config.
 */
let config: Config = {
	clientId: '',
	clientSecret: '',
}

/** Prepare the API configuration for authentication. */
export function prepareConfigurationForAuth(configuration: Api.Configuration) {
	configuration.accessToken = (name: string, scopes?: string[]): string => {
		return ''
	}
}

export function getAuthConfig(): Config {
	return config
}

export function setAuthConfig(newConfig: Config) {
	config = newConfig
}
