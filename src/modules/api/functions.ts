import { put, call, select } from 'redux-saga/effects'
import { SagaIterator } from 'redux-saga'
import { Action, AsyncActionCreators } from 'typescript-fsa'

import { refreshTokenNow } from 'auth/sagas'
import * as selectors from './selectors'
import { getErrorTransformer } from '.'

/** A generic function for calling API while calling typescript-fsa async action's done and failed
 * actions.
 */
export function* callApi<A, B>(
	action: Action<A>, 
	async: AsyncActionCreators<A, B, Error>, 
	func: (payload: A, options: RequestInit) => Promise<B>, 
	retry: boolean = true
): SagaIterator {
	/* Check if there are any offline changes queued, and don't allow GET requests through, as we
	   might load information that would replace our pending changes in the state, such as resetting
	   a job state back to the server state, before we've had a chance to POST the change.
	 */
	const queueLength = (yield select(selectors.offlineOutboxQueueLength)) as number
	if (queueLength > 0) {
		let error = new Error('Offline changes are queued')

		yield put(async.failed({ params: action.payload, error}))
		return
	}

	let result: B
	try {
		result = yield call(func, action.payload, {})
	} catch (response) {
		if (response instanceof Response) {
			if (response.status === 401) {
				if (retry) {
					const refreshResult = yield call(refreshTokenNow)				
					if (refreshResult) {
						yield call(callApi, action, async, func, false)
						return
					}
				}
			}

			const errorTransformer = getErrorTransformer()
			if (errorTransformer) {
				const error = errorTransformer(response)
				yield put(async.failed({ params: action.payload, error }))
			} else {
				const error = new Error(response.statusText)
				error.name = 'APIError'
				yield put(async.failed({ params: action.payload, error }))
			}
		} else if (response instanceof Error) {
			yield put(async.failed({ params: action.payload, error: response }))
		} else {
			yield put(async.failed({ params: action.payload, error: new Error('Unknown API response') }))
		}
		return
	}

	yield put(async.done({ params: action.payload, result }))
}

export function timestamp() {
	return new Date().toISOString()
}
