import { reducerWithInitialState } from 'typescript-fsa-reducers'
import produce from 'immer'

/* Import our module's actions */
import * as a from './actions'

/**
 * Export the immutable StoreState interface for this module. We always name this interface
 * `StoreState` so it is consistent across each of our modules.
 */
export type StoreState = DeepReadonly<MutableStoreState>

interface MutableStoreState {
	name: string
}

/**
 * The initial store state for this module.
 */
const INITIAL_STATE: StoreState = produce(
	{
		/* Note that we end each property with a comma, so we can add new properties without modifying this line
		(improve your git diffs!).
		*/
		name: 'React + Redux + Typescript pattern',
	},
	draft => draft)

/**
 * Reducer function for this module.
 */
export const reducer = reducerWithInitialState(INITIAL_STATE)

/** Reducer function for the exampleAction that returns a new state using an implicit return. */
reducer.case(a.examplePayloadAction, (state, payload) => produce(state, draft => {
	draft.name = payload.value
}))

/** Reducer function for examplePrimitiveAction that returns a new state using an explicit return. */
reducer.case(a.examplePrimitivePayloadAction, (state, name) => produce(state, draft => {
	draft.name = name
}))
