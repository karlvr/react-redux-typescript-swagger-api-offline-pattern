import { Action, Failure } from 'typescript-fsa'
import { ApiError } from './functions'

/** The type signature of an async failure action that contains a payload compatible with ApiError */
export type ApiFailedAction = Action<Failure<{}, ApiError>>
