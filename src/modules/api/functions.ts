import { put, call, select } from 'redux-saga/effects'
import { SagaIterator } from 'redux-saga'
import { Action, AsyncActionCreators } from 'typescript-fsa'

import { refreshTokenNow } from 'auth/sagas'
import * as selectors from './selectors'

/** A generic function for calling API while calling typescript-fsa async action's done and failed
 * actions.
 */
export function* callApi<A, B, C>(
	action: Action<A>, 
	async: AsyncActionCreators<A, B, C>, 
	func: (payload: A, options: RequestInit) => Promise<B>, retry: boolean = true
): SagaIterator {
	/* Check if there are any offline changes queued, and don't allow GET requests through, as we
	   might load information that would replace our pending changes in the state, such as resetting
	   a job state back to the server state, before we've had a chance to POST the change.
	 */
	const queueLength = (yield select(selectors.offlineOutboxQueueLength)) as number
	if (queueLength > 0) {
		let error = new Error('Offline changes are queued')

		yield put(async.failed({ params: action.payload, error: (error as {}) as C }))
		return
	}

	try {
		let result = yield call(() => {
			return func(action.payload, {})
		})

		yield put(async.done({ params: action.payload, result }))
	} catch (error) {
		if (error.status === 401) {
			if (retry) {
				const refreshResult = yield call(refreshTokenNow)				
				if (refreshResult) {
					yield call(callApi, action, async, func, false)
					return
				}
			}
		}
		yield put(async.failed({ params: action.payload, error }))
	}
}

export function timestamp() {
	return new Date().toISOString()
}
