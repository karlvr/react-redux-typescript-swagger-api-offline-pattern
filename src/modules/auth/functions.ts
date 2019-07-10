/**
 * Functions for sending OAuth2 requests to the server.
 */

import { AccessToken } from './types'
import * as url from 'url'
import { getAuthConfig } from '.'

/** How many seconds before the access token expires do we refresh it */
const REFRESH_TOKEN_WINDOW = 60

async function fetchAccessToken(options: RequestInit): Promise<AccessToken> {
	const response = await fetch(getAuthConfig().tokenEndpoint, options)
	if (response.ok) {
		const accessToken = await response.json() as AccessToken

		/* Add the refreshAt date to the token, so we know when to refresh it */
		const result: AccessToken = {
			...accessToken,
			refreshAt: Date.now() + (accessToken.expires_in - REFRESH_TOKEN_WINDOW) * 1000,
		}
		return result
	} else {
		const contentType = response.headers.get('Content-Type')
		if (contentType && contentType.indexOf('json') !== -1) {
			const msg = await response.json()
			if (msg.error) {
				throw new Error(`Auth request failed: ${msg.error}`)
			} else {
				throw new Error(`Auth request failed: ${response.statusText}`)
			}
		} else {
			throw new Error(`Auth request failed: ${response.statusText}`)
		}
	}
}

/** Attempt to obtain an AccessToken with the given credentials. */
export function authenticate(username: string, password: string): Promise<AccessToken> {
	const config = getAuthConfig()
	const query = {
		// eslint-disable-next-line @typescript-eslint/camelcase
		client_id: config.clientId,
		// eslint-disable-next-line @typescript-eslint/camelcase
		client_secret: config.clientSecret,
		// eslint-disable-next-line @typescript-eslint/camelcase
		grant_type: 'password',
		username,
		password,
	}
	const formData = url.format({ query }).substring(1)

	const options: RequestInit = {
		method: 'POST',
		body: formData,
		headers: {
			'content-type': 'application/x-www-form-urlencoded',
		},
	}
	return fetchAccessToken(options)
}

/** Attempt to refresh the AccessToken using the given refresh token.
 * Returns a new AccessToken.
 */
export function refresh(refreshToken: string): Promise<AccessToken> {
	const config = getAuthConfig()
	let query = {
		// eslint-disable-next-line @typescript-eslint/camelcase
		client_id: config.clientId,
		// eslint-disable-next-line @typescript-eslint/camelcase
		client_secret: config.clientSecret,
		// eslint-disable-next-line @typescript-eslint/camelcase
		grant_type: 'refresh_token',
		// eslint-disable-next-line @typescript-eslint/camelcase
		refresh_token: refreshToken,
	}
	let formData = url.format({ query }).substring(1)

	let options: RequestInit = {
		method: 'POST',
		body: formData,
		headers: {
			'content-type': 'application/x-www-form-urlencoded',
		},
	}
	return fetchAccessToken(options)
}

/** Refresh the access token, apply it to the store, and return a promise
 * indicating whether or not it was successful. This methods gets the current
 * refresh token from the store, so there's no need to know any context to
 * call it.
 */
export async function refreshTokenAndApply(): Promise<AccessToken> {
	const accessToken = getAuthConfig().accessToken()
	if (accessToken) {
		let refreshedAccessToken: AccessToken
		try {
			refreshedAccessToken = await refresh(accessToken.refresh_token)
		} catch (error) {
			getAuthConfig().refreshAccessTokenFailed()
			throw error
		}

		getAuthConfig().refreshedAccessToken(refreshedAccessToken)
		return refreshedAccessToken
	} else {
		throw new Error('Not logged in')
	}
}
