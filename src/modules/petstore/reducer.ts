import { reducerWithInitialState } from 'typescript-fsa-reducers'
import { produce } from 'immer'

/* Import our module files */
import * as actions from './actions'
import { Pet } from './types'

/**
 * Export the immutable StoreState interface for this module. We always name this interface
 * `StoreState` so it is consistent across each of our modules.
 */
export type StoreState = DeepReadonly<MutableStoreState>

interface MutableStoreState {
	pets: Pet[]
	error?: Error
}

/**
 * The initial store state for this module.
 */
const INITIAL_STATE: StoreState = produce(
	{
		pets: [],
	},
	draft => draft)

/**
 * Reducer function for this module.
 */
export const reducer = reducerWithInitialState(INITIAL_STATE)

reducer.case(actions.requestPets.started, (state) => produce(state, draft => {
	draft.pets = []
	draft.error = undefined
}))

reducer.case(actions.requestPets.done, (state, { result: pets }) => produce(state, draft => {
	draft.pets = pets
}))

reducer.case(actions.requestPets.failed, (state, { error }) => produce(state, draft => {
	draft.error = error
}))

reducer.case(actions.addPet, (state, payload) => produce(state, draft => {
	draft.pets.unshift(payload)
	draft.error = undefined
}))
