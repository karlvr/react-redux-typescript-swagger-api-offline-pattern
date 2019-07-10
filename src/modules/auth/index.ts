import { Config } from './types'

/** The authentication module config, with default values.
 * Use the setConfig method to update the config.
 */
let config: Config | undefined

export function getAuthConfig(): Config {
	if (!config) {
		throw new Error('setAuthConfig has not been called')
	}
	return config
}

export function setAuthConfig(newConfig: Config) {
	config = newConfig
}
