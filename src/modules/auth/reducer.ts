/**
 * Reducer for authentication.
 * 
 * Responsible for updating our authentication status in the Redux state.
 */

import { reducerWithInitialState } from 'typescript-fsa-reducers/dist'
import * as actions from './actions'
import { AccessToken } from './types'
import { readyAction } from '@modules/root/actions'
import produce from 'immer'

/** The store state for the auth module. */
export type StoreState = DeepReadonly<MutableStoreState>

interface MutableStoreState {
	username?: string
	accessToken?: AccessToken
	error?: Error
	loggingIn: boolean
	refreshFailedAt?: number
}

const INITIAL_STATE: StoreState = {
	accessToken: undefined,
	loggingIn: false,
}

export const reducer = reducerWithInitialState(INITIAL_STATE)

reducer.case(actions.refreshedToken, (state, accessToken) => {
	return { ...state, accessToken, refreshFailedAt: undefined }
})

reducer.case(actions.refreshTokenFailed, (state, date) => produce(state, draft => {
	/* When the refresh token fails we blank the accessToken, so the app knows we need to re-auth, but we do not
		do the loggedOut action, so we retain our username property, so we know we need to re-auth as that user
		in order to preserve our offline queue.
		*/
	draft.accessToken = undefined
	draft.refreshFailedAt = date
}))

reducer.case(actions.login.done, (state, { params: requestPayload, result: accessToken }) => produce(state, draft => {
	draft.username = requestPayload.username
	draft.accessToken = accessToken
	draft.loggingIn = false
	draft.refreshFailedAt = undefined
}))

reducer.case(actions.login.failed, (state, { error }) => produce(state, draft => {
	draft.error = error
	draft.loggingIn = false
}))

reducer.case(actions.login.started, (state) => produce(state, draft => {
	draft.error = undefined
	draft.loggingIn = true
}))

reducer.case(readyAction, (state) => produce(state, draft => {
	draft.loggingIn = false
}))

/* The user has been logged out remove our stored access token from the state. */
reducer.case(actions.loggedOut, (state) => INITIAL_STATE)
