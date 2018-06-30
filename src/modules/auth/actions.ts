/**
 * Action creators for authentication.
 */

import actionCreatorFactory from 'typescript-fsa'
import { AccessToken, LoginRequest } from './types'

const actionCreator = actionCreatorFactory('Auth')

export const login = actionCreator.async<LoginRequest, AccessToken, Error>('LOGIN')

export const refreshedToken = actionCreator<AccessToken>('REFRESHED_TOKEN')

/** Signals that refreshing failed. The payload is the time that it failed. */
export const refreshTokenFailed = actionCreator<number>('REFRESH_TOKEN_FAILED')

/** Action creator for the logout request. */
export const logoutRequest = actionCreator('LOGOUT_REQUEST')

/** The user has been logged out. */
export const loggedOut = actionCreator('LOGGED_OUT')

/** An error has occurred while the user is logged in, either logging out or refreshing the token. */
export const loggedInError = actionCreator<Error>('LOGGED_IN_ERROR')
