/**
 * Authentication sagas.
 * 
 * Responsible for the process of logging in, refreshing tokens and logging out.
 */

import { take, call, put, race, select } from 'redux-saga/effects'
import * as actions from './actions'
import { authenticate, refresh } from './functions'
import { LoginRequestPayload } from './actions'
import { SagaIterator } from 'redux-saga'
import { RootStoreState } from 'root/index'
import { readyAction } from '../root/actions'
import { AccessToken } from './types'

import { accessTokenSelector } from './selectors'
import { offlineOutboxQueueLength } from 'api/selectors'
import platform from 'platform/index'

/** Saga handling the state of being logged out. */
function* loggedOutSaga(): SagaIterator {
	/* Wait for a login request, but we also look for a logout request */
	const loginRaceResult = yield race({
		loginRequest: take(actions.login.started),
		logout: take(actions.logoutRequest),
	})
	
	if (loginRaceResult.logout) {
		/* A logout request may come through if we're only partially logged out. That is we don't
		   have an access token, but we do have a username set, and we want the user to re-login
		   without logging out. But they can choose to logout completely, so we handle that here.
		 */
		yield call(handleLogoutRequest)
		return
	}

	let login = loginRaceResult.loginRequest.payload as LoginRequestPayload
	try {
		/* Attempt to login, but also let a logout request interrupt our login request */
		const loggingInRaceResult = yield race({
			loginResult: call(authenticate, login.username, login.password),
			logout: take(actions.logoutRequest),
		})

		if (loggingInRaceResult.loginResult) {
			let accessToken = loggingInRaceResult.loginResult as AccessToken
			yield put(actions.login.done({ params: login, result: accessToken }))
		} else if (loggingInRaceResult.logout) {
			yield call(handleLogoutRequest)
		}
	} catch (error) {
		yield put(actions.login.failed({ params: login, error }))
	}
}

/** Saga handling the state of being logged in. */
function* loggedInSaga(): SagaIterator {
	try {
		let raceResult = yield race({
			logout: take(actions.logoutRequest),
			loggedInError: take(actions.loggedInError),
			refreshTokenFailed: take(actions.refreshTokenFailed),
		})

		if (raceResult.logout) {
			yield call(handleLogoutRequest)
		} else if (raceResult.loggedInError) {
			yield put(actions.loggedOut())
		} else if (raceResult.refreshTokenFailed) {
			/* There's nothing for us to do here, as the routing saga handles this to take us to the login form to reauth. */
		}
	} catch (error) {
		yield put(actions.loggedInError(error))
		yield put(actions.loggedOut())
	}
}

/** When we request to logout we must check if we have an offline queue that will be lost if
 *  we actually logout. So we do a confirm step first whenever there is a logout request and our
 *  offline queue is not empty.
 */
function* handleLogoutRequest(): SagaIterator {
	const queueLength = yield select(offlineOutboxQueueLength)
	if (queueLength > 0) {
		const confirmResult = (yield call(
			platform.confirm, 
			'Are you sure you want to logout? You have unsynced updates that will be lost.',
			'Warning!',
			'Logout')) as boolean
		if (confirmResult) {
			yield put(actions.loggedOut())
		}
	} else {
		yield put(actions.loggedOut())
	}
}

/** Yields a boolean result, whether there is a user logged in or not. */
export function* loggedIn(): SagaIterator {
	let accessToken = yield select<RootStoreState>(accessTokenSelector)
	return accessToken !== undefined
}

var refreshingToken = false

export function* refreshTokenNow(): SagaIterator {
	let accessToken = (yield select<RootStoreState>(accessTokenSelector)) as AccessToken
	if (!accessToken) {
		throw new Error('Not logged in')
	}

	if (!refreshingToken) {
		refreshingToken = true
		try {
			let refreshedAccessToken = (yield call(refresh, accessToken.refresh_token)) as AccessToken
			refreshingToken = false
			yield put(actions.refreshedToken(refreshedAccessToken))
			return true
		} catch (error) {
			refreshingToken = false

			// TODO: this is nasty relying on the error message format
			if (error.message === 'Auth request failed: invalid_grant') {
				yield put(actions.refreshTokenFailed(Date.now()))
			}
			return false
		}
	} else {
		/* The token is already being refreshed, so wait for the result of that operation, so we don't
		   double-up our refresh requests.
		 */
		const raceResult = yield race({
			refreshedToken: take(actions.refreshedToken),
			loggedInError: take(actions.loggedInError),
			refreshTokenFailed: take(actions.refreshTokenFailed),
		})

		if (raceResult.refreshedToken) {
			return true
		} else {
			return false
		}
	}
}

export default function* saga(): SagaIterator {
	/* Wait for the state to be ready, as we read the state in the loggedIn function.
	The state isn't immediately ready, as we use react-persist to load persisted state,
	which happens asynchronously.
	*/
	yield take(readyAction)

	while (true) {
		let isLoggedIn = (yield call(loggedIn)) as boolean

		if (isLoggedIn) {
			yield call(loggedInSaga)
		} else {
			yield call(loggedOutSaga)
		}
	}
}
