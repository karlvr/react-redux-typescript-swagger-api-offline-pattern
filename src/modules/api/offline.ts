/**
 * Redux Offline callback function implementations.
 */

import { OfflineAction } from '@redux-offline/redux-offline/lib/types'
import { Failure, ActionCreator, AsyncActionCreators, Meta, Action } from 'typescript-fsa'

import { refreshTokenAndApply } from 'modules/auth/functions'

export type ApiActionHandler<P, R> = (payload: P, options: RequestInit) => Promise<R>

const API_HANDLER_NOT_FOUND_ERROR = 'APIHandlerNotFoundError'

const handlersByActionType: {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[type: string]: ApiActionHandler<any, any>
} = {}

/** Wrap promise results into the result format expected by typescript-fsa async actions so
 * the payload on the done and failed actions matches the type signatures provided by
 * typescript-fsa.
 */
function handleOfflineAction(action: OfflineAction, retry: boolean = true): Promise<object | undefined> {
	const handler = handlersByActionType[action.type]
	if (!handler) {
		const error = new Error(`No offline API handler found for action: ${action.type}`)
		error.name = API_HANDLER_NOT_FOUND_ERROR
		return Promise.reject({ params: action.payload, error })
	}

	const promise = handler(action.payload, {})
	return promise.then(result => {
		return Promise.resolve({ params: action.payload, result })
	}).catch(error => {
		if (error instanceof Response) {
			if (error.status === 401) {
				if (retry) {
					return refreshTokenAndApply().then(() => {
						return handleOfflineAction(action, false)
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

export function handleDiscard(failure: Failure<object, Response | Error>, action: OfflineAction, retries: number = 0) {
	/* The Swagger Codegen API throws the response in the event of an error, so we use the
	status code from the response to determine whether to discard. And we use wrapPromise to wrap the results
	of the API into the Success or Failure containers that typescript-fsa uses, so we deconstruct those here.
	*/
	if (failure.error instanceof Response) {
		if (failure.error.status === 401) {
			/* Don't discard in the face of auth errors, we will try again once we're authed. */
			return false
		}
		// if (error.error.status === 500) { return true }
		return failure.error.status >= 400 && failure.error.status < 500
	} else if (failure.error instanceof Error) {
		if (failure.error.name && failure.error.name === API_HANDLER_NOT_FOUND_ERROR) {
			/* We haven't been able to handle this API request so we must drop it. This is a programming error. */
			console.error(failure.error)
			return true
		}
	}

	/* We don't want to discard anything that is not an instance of Response, because the request didn't make it to the server. */
	return false
}

export function handleEffect(effect: {}, action: OfflineAction): Promise<object | undefined> {
	return handleOfflineAction(action)
}

/** 
 * Wrap an async action creator so that it creates actions with the metadata for redux-offline. So
 * when you create and dispatch the wrapped `started` action, it will be picked up and handled by redux-offline.
 */
export function wrapOfflineAction<P, R, B, C>(action: AsyncActionCreators<P, B, C>, handler: ApiActionHandler<P, R>): AsyncActionCreators<P, B, C> {
	/* Remember the handler so we can find it later when handleEffect needs it. */
	handlersByActionType[action.started.type] = handler

	const newActionStartedCreator = function (payload: P, meta?: Meta): Action<P> {
		const result = action.started(payload, meta)
		result.meta = {
			...result.meta,
			offline: {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				commit: action.done({ params: payload, result: undefined as any as B }),
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				rollback: action.failed({ params: payload, error: {} as any as C }),
			},
		}
		return result
	}

	const newActionStarted = newActionStartedCreator as ActionCreator<P>
	newActionStarted.type = action.started.type
	newActionStarted.match = action.started.match

	const newActionCreator: AsyncActionCreators<P, B, C> = {
		type: action.type,
		started: newActionStarted,
		done: action.done,
		failed: action.failed,
	}
	return newActionCreator
}
