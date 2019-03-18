import { put, call, select } from 'redux-saga/effects'
import { SagaIterator } from 'redux-saga'
import { AsyncActionCreators } from 'typescript-fsa'

import { refreshTokenNow } from '@modules/auth/sagas'
import * as selectors from './selectors'

/** Calls an API and returns the result, or throws an Error.
 * @throws An Error, if one occurs. Transformed from the Response by the registered ErrorTransformer.
 * @returns The Api RESPONSE object.
 */
export function* callApi<REQUEST, RESPONSE>(payload: REQUEST, func: (payload: REQUEST, options: RequestInit) => Promise<RESPONSE>, retry: boolean = true): SagaIterator {
	
	/* Check if there are any offline changes queued, and don't allow GET requests through, as we
	   might load information that would replace our pending changes in the state, such as resetting
	   a job state back to the server state, before we've had a chance to POST the change.
	 */
	const queueLength = (yield select(selectors.offlineOutboxQueueLength)) as number
	if (queueLength > 0) {
		throw new Error('Offline changes are queued')
	}

	try {
		return (yield call(func, payload, {})) as RESPONSE
	} catch (response) {
		if (response instanceof Response) {
			/* Check for an authorisation failed and try to refresh our access token */
			if (response.status === 401) {
				if (retry) {
					const refreshResult = yield call(refreshTokenNow)

					if (refreshResult) {
						return yield call(callApi, payload, func, false)
					} else {
						throw new Error('Refresh token cancelled')
					}
				}
			}

			let errorResponse
			try {
				/* We try to parse the server response as JSON, which will contain information that our code can use */
				errorResponse = yield call(() => response.json())
			} catch {
				/* We couldn't parse the response as JSON so we report a generic error */
				throw new Error(`Unexpected response from server (${response.status})`)
			}

			throw errorResponse
		} else if (response instanceof Error) {
			throw response
		} else {
			throw new Error('Unknown API response')
		}
	}
}

/** Calls the API and dispatches async actions to notify of starting, result or error.
 * Returns a boolean whether the request succeeded or failed, but does not throw an errors.
 * @param payload The request payload
 * @param async An async action of type <REQUEST, RESPONSE, Error>
 * @param func A function that is called to perform the API operation, that returns a Promise that yields the response, or throws an Error or Response.
 * @returns true if the API request suceeded or false.
 */
export function* callApiWithActions<REQUEST, RESPONSE, ERROR>(payload: REQUEST, async: AsyncActionCreators<REQUEST, RESPONSE, ERROR>, func: (options: RequestInit) => Promise<RESPONSE>): SagaIterator {
	/* Signal the start of the API interaction */
	yield put(async.started(payload))

	try {
		const result = (yield call(callApi, payload, func)) as RESPONSE
		yield put(async.done({ params: payload, result }))
		return true
	} catch (error) {
		yield put(async.failed({ params: payload, error }))
		return false
	}
}

export type ApiError = Error | ApiErrorWithMessages
export interface ApiErrorWithMessages {
	messages: {
		message: string
	}[]
}

/** Takes an API error response and returns a message to be displayed to the user. */
export function apiErrorToMessage(error: ApiError): string {
	if (error instanceof Error) {
		return error.message
	} else if (error.messages) {
		return error.messages.map(m => m.message).join('\n\n')
	} else {
		return 'Unknown error'
	}
}
