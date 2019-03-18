/**
 * Functions for sending OAuth2 requests to the server.
 */

import { AccessToken } from './types'
import * as url from 'url'
import { store } from '@modules/root/index'
import * as actions from './actions'
import { getAuthConfig } from '.'

/** How many seconds before the access token expires do we refresh it */
const REFRESH_TOKEN_WINDOW = 60

function fetchAccessToken(options: RequestInit): Promise<AccessToken> {
	return fetch(getAuthConfig().tokenEndpoint, options)
		.then(response => {
			if (response.ok) {
				return response.json()
			} else {
				let contentType = response.headers.get('Content-Type')
				if (contentType && contentType.indexOf('json') !== -1) {
					return response.json().then(msg => {
						if (msg.error) {
							throw new Error('Auth request failed: ' + msg.error)
						} else {
							throw new Error('Auth request failed: ' + response.statusText)
						}
					})
				} else {
					throw new Error('Auth request failed: ' + response.statusText)
				}
			}
		})
		.then(json => json as AccessToken)
		.then(accessToken => {
			/* Add the refreshAt date to the token, so we know when to refresh it */
			return {
				...accessToken,
				refreshAt: Date.now() + (accessToken.expires_in - REFRESH_TOKEN_WINDOW) * 1000,
			} as AccessToken
		})
}

/** Attempt to obtain an AccessToken with the given credentials. */
export function authenticate(username: string, password: string): Promise<AccessToken> {
	const config = getAuthConfig()
	let query = {
		client_id: config.clientId,
		client_secret: config.clientSecret,
		grant_type: 'password',
		username,
		password,
	}
	let formData = url.format({ query }).substring(1)

	let options: RequestInit = {
		method: 'POST',
		body: formData,
		headers: {
			'content-type': 'application/x-www-form-urlencoded'
		}
	}
	return fetchAccessToken(options)
}

/** Attempt to refresh the AccessToken using the given refresh token.
 * Returns a new AccessToken.
 */
export function refresh(refreshToken: string): Promise<AccessToken> {
	const config = getAuthConfig()
	let query = {
		client_id: config.clientId,
		client_secret: config.clientSecret,
		grant_type: 'refresh_token',
		refresh_token: refreshToken,
	}
	let formData = url.format({ query }).substring(1)

	let options: RequestInit = {
		method: 'POST',
		body: formData,
		headers: {
			'content-type': 'application/x-www-form-urlencoded'
		}
	}
	return fetchAccessToken(options)
}

/** Refresh the access token, apply it to the store, and return a promise
 * indicating whether or not it was successful. This methods gets the current
 * refresh token from the store, so there's no need to know any context to
 * call it.
 */
export function refreshTokenAndApply(): Promise<AccessToken> {
	return new Promise((resolve, reject) => {
		let accessToken = store.getState().auth.accessToken
		if (accessToken) {
			refresh(accessToken.refresh_token).then(refreshedAccessToken => {
				store.dispatch(actions.refreshedToken(refreshedAccessToken))
				resolve(refreshedAccessToken)
			}).catch(error => {
				store.dispatch(actions.refreshTokenFailed(Date.now()))
				reject(error)
			})
		} else {
			reject(new Error('Not logged in'))
		}
	})
}
