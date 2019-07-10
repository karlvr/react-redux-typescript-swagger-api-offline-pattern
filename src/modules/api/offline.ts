/**
 * Redux Offline callback function implementations.
 */

import { OfflineAction } from '@redux-offline/redux-offline/lib/types'
import { Failure, ActionCreator, AsyncActionCreators, Meta, Action, Success } from 'typescript-fsa'

import { refreshTokenAndApply } from 'modules/auth/functions'

export type OfflineActionHandler<P, R> = (payload: P) => Promise<R>

/** If your offline action handler throws an Error, it will be converted to this type in the failed action payload. */
export interface OfflineActionGenericError {
	name: string
	message: string
}

/** If your offline action handler throws a Response that cannot be parsed as JSON, it will be converted to this type in the failed action payload. */
export interface OfflineActionGenericResponseError {
	status: number
	statusText: string
}

/** The error name to use for errors that cannot be recovered and indicate that a request should not be retried */
const OFFLINE_HANDLER_ERROR = 'OfflineHandlerError'

const handlersByActionType: {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[type: string]: OfflineActionHandler<any, any>
} = {}

/** Wrap promise results into the result format expected by typescript-fsa async actions so
 * the payload on the done and failed actions matches the type signatures provided by
 * typescript-fsa.
 */
async function handleOfflineAction(action: OfflineAction, retry: boolean = true): Promise<unknown> {
	const handler = handlersByActionType[action.type]
	if (!handler) {
		const error = new Error(`No offline handler found for action: ${action.type}`)
		error.name = OFFLINE_HANDLER_ERROR
		throw error
	}

	try {
		return await handler(action.payload)
	} catch (error) {
		if (error instanceof Response) {
			if (error.status === 401) {
				if (retry) {
					try {
						await refreshTokenAndApply()
					} catch (refreshError) {
						/* Ignore refresh error */
					}
					
					return handleOfflineAction(action, false)
				}

				/* Let handleDiscard handle our auth error */
				throw error
			}

			if (error.status >= 200 && error.status < 500) {
				let errorResponse
				try {
					/* We try to parse the server response as JSON, which will contain information that our code can use */
					errorResponse = await error.json()
				} catch {
					/* We couldn't parse the response as JSON so we report a generic error */
					throw new Error(`Unexpected response from server (${error.status})`)
				}

				// eslint-disable-next-line no-throw-literal
				throw errorResponse
			} else {
				throw new Error(`Unexpected response from server (${error.status})`)
			}
		} else if (error instanceof Error) {
			throw error
		} else {
			/* Unknown error type, let's just throw it on */
			throw error
		}
	}
}

export async function handleEffect(effect: {}, action: OfflineAction): Promise<Success<unknown, unknown>> {
	try {
		const result = await handleOfflineAction(action)
		/* Return the result in the style that AsyncActionCreators requires it. */
		return {
			params: action.payload,
			result,
		}
	} catch (error) {
		/* Throw the error in the style that AsyncActionCreators requires it */
		const result: Failure<unknown, unknown> & { actualError?: Response | Error } = {
			params: action.payload,
			error,
		}

		/* We transform known error types into JSON stringifiable types as redux-offline converts
		   errors using JSON.stringify so detail is lost is we don't.
		   */
		if (error instanceof Error) {
			const fakeError: OfflineActionGenericError = {
				name: error.name,
				message: error.message,
			}
			result.error = fakeError

			/* We store the actual error so handleDiscard can use it */
			result.actualError = error
		} else if (error instanceof Response) {
			const fakeError: OfflineActionGenericResponseError = {
				status: error.status,
				statusText: error.statusText,
			}

			result.error = fakeError
			result.actualError = error
		}

		throw result
	}
}

export function handleDiscard(failure: Failure<unknown, unknown> & { actualError?: Response | Error }, action: OfflineAction, retries: number = 0) {
	/* The Swagger Codegen API throws the response in the event of an error, so we use the
	status code from the response to determine whether to discard. And we use wrapPromise to wrap the results
	of the API into the Success or Failure containers that typescript-fsa uses, so we deconstruct those here.
	*/
	if (failure.actualError instanceof Response) {
		if (failure.actualError.status === 401) {
			/* Don't discard in the face of auth errors, we will try again once we're authed. */
			return false
		}
		// if (error.error.status === 500) { return true }
		return failure.actualError.status >= 400 && failure.actualError.status < 500
	} else if (failure.actualError instanceof Error) {
		if (failure.actualError.name && failure.actualError.name === OFFLINE_HANDLER_ERROR) {
			/* We haven't been able to handle this action so we must drop it. This represents a programming error. */
			console.error(failure.actualError)
			return true
		}
	}

	/* We don't want to discard anything that is not an instance of Response, because the request didn't make it to the server. */
	return false
}

/** 
 * Wrap an async action creator so that it creates actions with the metadata for redux-offline. So
 * when you create and dispatch the wrapped `started` action, it will be picked up and handled by redux-offline.
 */
export function wrapOfflineAction<P, R, E>(asyncActionCreators: AsyncActionCreators<P, R, E>, handler: OfflineActionHandler<P, R>): AsyncActionCreators<P, R, E> {
	const started = asyncActionCreators.started

	/* Remember the handler so we can find it later when handleEffect needs it. */
	handlersByActionType[started.type] = handler

	const newActionStartedCreator = function (payload: P, meta?: Meta): Action<P> {
		const result = started(payload, meta)
		result.meta = {
			...result.meta,
			offline: {
				commit: {
					type: asyncActionCreators.done.type,
				},
				rollback: {
					type: asyncActionCreators.failed.type,
				},
			},
		}
		return result
	}

	const newActionStarted = newActionStartedCreator as ActionCreator<P>
	newActionStarted.type = asyncActionCreators.started.type
	newActionStarted.match = asyncActionCreators.started.match

	const newActionCreator: AsyncActionCreators<P, R, E> = {
		type: asyncActionCreators.type,
		started: newActionStarted,
		done: asyncActionCreators.done,
		failed: asyncActionCreators.failed,
	}
	return newActionCreator
}
