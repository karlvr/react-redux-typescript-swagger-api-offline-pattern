/**
 * Redux Offline callback function implementations.
 */

import { OfflineAction } from '@redux-offline/redux-offline/lib/types'
import { Failure, ActionCreator, AsyncActionCreators, Meta, Action } from 'typescript-fsa'

import * as actions from './actions'
import { refreshTokenAndApply } from '@modules/auth/functions'

type GenericActionCreatorFunction = ((result: {}) => ({}))

type ApiActionHandler<P> = (payload: P, options: RequestInit) => Promise<object | undefined | void>

/** Wrap promise results into the result format expected by typescript-fsa async actions so
 * the payload on the done and failed actions matches the type signatures provided by
 * typescript-fsa.
 */
function apiPromise(action: OfflineAction, retry: boolean = true): Promise<object | undefined> {
	const handler = handlerForAction(action)
	if (!handler) {
		return Promise.reject({ params: action.payload, error: new Error('No offline API handler found for action: ' + action.type) })
	}

	let promise = handler(action.payload!, {})
	return promise.then(result => {
		return Promise.resolve({ params: action.payload, result })
	}).catch(error => {
		if (error instanceof Response) {
			if (error.status === 401) {
				if (retry) {
					return refreshTokenAndApply().then(() => {
						return apiPromise(action, false)
					}).catch(refreshError => {
						/* Must fail with the original error so that handleDiscard can handle this correctly. */
						return Promise.reject({ params: action.payload, error })
					})
				} else {
					/* Fall through to Promise.reject below */
				}
			}
		}
		return Promise.reject({ params: action.payload, error })
	})
}

export function handleDiscard(error: Failure<{}, Response>, action: OfflineAction, retries: number = 0) {
	/* The Swagger Codegen API throws the response in the event of an error, so we use the
	status code from the response to determine whether to discard. And we use wrapPromise to wrap the results
	of the API into the Success or Failure containers that typescript-fsa uses, so we deconstruct those here.
	*/
	if (error.error instanceof Response) {
		if (error.error.status === 401) {
			/* Don't discard in the face of auth errors, we will try again once we're authed. */
			return false
		}
		// if (error.error.status === 500) { return true }
		return error.error.status >= 400 && error.error.status < 500
	} else if ((error.error as {}) instanceof Error) {
		const otherError = error.error as Error
		if (otherError.message === 'Failed to fetch') {
			/* Occurs when blacklisting in Charles */
			return false
		}
	} else {
		if (error.error === 'Timeout error') {
			/* Allow requests that fail due to timeout to retry. The string 'Timeout error' is the default string from the fetch-timeout module. */
			return false
		}
	}

	/* Other errors that aren't thrown responses are always discarded. */
	return true
}

export function handleEffect(effect: {}, action: OfflineAction): Promise<object | undefined> {
	return apiPromise(action)
}

interface AsyncActionCreatorsWithHandler<P> {
	handler: ApiActionHandler<P>
}

/** Wrap an async action creator so that it creates actions with the metadata for redux-offline. So
 * when you create and dispatch the started action from the resulting action creator, it will be picked
 * up and handled by redux-offline.
 */
export function wrapOfflineAction<P, B, C>(action: AsyncActionCreators<P, B, C>, handler: ApiActionHandler<P>): AsyncActionCreators<P, B, C> {
	let newActionStartedCreator = function (payload: P, meta?: Meta): Action<P> {
		let result = action.started(payload, meta)
		result.meta = {
			...result.meta,
			offline: {
				commit: (action.done as GenericActionCreatorFunction)({ params: payload, result: undefined }),
				rollback: (action.failed as GenericActionCreatorFunction)({ params: payload, result: {} }),
			},
		}
		return result
	}

	let newAction = newActionStartedCreator as ActionCreator<P>
	newAction.type = action.started.type
	newAction.match = action.started.match

	let actionCreator: AsyncActionCreators<P, B, C> = {
		type: action.type,
		started: newAction,
		done: action.done,
		failed: action.failed,
	};

	((actionCreator as {}) as AsyncActionCreatorsWithHandler<P>).handler = handler
	return actionCreator
}

/** Find the handler function for the given action. */
function handlerForAction(action: OfflineAction): ApiActionHandler<{}> | undefined {
	/* Find the handler function by iterating through all the exported actions, looking for the one with the right type.
	   The handler function is inserted into the action creator by wrapOfflineAction.
	*/
	for (let o in actions) {
		if (typeof actions[o] === 'object' && typeof actions[o].started === 'function' && actions[o].started.type === action.type) {
			return actions[o].handler
		}
	}
	return undefined
}
