/**
 * Reducer for authentication.
 * 
 * Responsible for updating our authentication status in the Redux state.
 */

import { reducerWithInitialState } from 'typescript-fsa-reducers/dist'
import * as actions from './actions'
import { AccessToken } from './types'
import { readyAction } from '../root/actions'

/** The store state for the auth module. */
export interface StoreState {
	readonly username?: string
	readonly accessToken?: AccessToken
	readonly error?: Error
	readonly loggingIn: boolean
	readonly refreshFailedAt?: number
}

const INITIAL_STATE: StoreState = {
	accessToken: undefined,
	loggingIn: false,
}

export const reducer = reducerWithInitialState(INITIAL_STATE)
	.case(actions.refreshedToken, (state, accessToken) => {
		return { ...state, accessToken, refreshFailedAt: undefined }
	})
	.case(actions.refreshTokenFailed, (state, date) => ({
		/* When the refresh token fails we blank the accessToken, so the app knows we need to re-auth, but we do not
		   do the loggedOut action, so we retain our username property, so we know we need to re-auth as that user
		   in order to preserve our offline queue.
		 */
		...state, accessToken: undefined, refreshFailedAt: date,
	}))
	.case(actions.login.done, (state, { params: requestPayload, result: accessToken }) => {
		return { ...state, username: requestPayload.username, accessToken, loggingIn: false, refreshFailedAt: undefined }
	})
	.case(actions.login.failed, (state, { error }) => {
		return { ...state, error: error, loggingIn: false }
	})
	.case(actions.login.started, (state) => {
		return { ...state, error: undefined, loggingIn: true }
	})
	.case(readyAction, (state) => {
		return { ...state, loggingIn: false }
	})
	/* The user has been logged out remove our stored access token from the state. */
	.case(actions.loggedOut, (state) => {
		return INITIAL_STATE
	})
