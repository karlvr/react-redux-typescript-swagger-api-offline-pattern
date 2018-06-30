import { Config } from './types'

/** The authentication module config, with default values.
 * Use the setConfig method to update the config.
 */
let config: Config | undefined

export function getAuthConfig(): Config {
	return config!
}

export function setAuthConfig(newConfig: Config) {
	config = newConfig
}
