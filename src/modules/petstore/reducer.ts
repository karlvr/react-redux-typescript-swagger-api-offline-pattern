import { reducerWithInitialState } from 'typescript-fsa-reducers'

/* Import our module files */
import * as actions from './actions'
import { Pet } from './types'

/**
 * Export the StoreState interface for this module. We always name this interface
 * `StoreState` so it is consistent across each of our modules.
 * All of the properties in the interface should be annotated `readonly`, as should
 * all of the properties down the tree.
 */
export interface StoreState {
	readonly pets: ReadonlyArray<Pet>
	readonly error?: Error
}

/**
 * The initial store state for this module.
 */
const INITIAL_STATE: StoreState = {
	pets: [],
}

/**
 * Reducer function for this module.
 */
export const reducer = reducerWithInitialState(INITIAL_STATE)
	.case(actions.requestPets.started, (state) => ({
		...state, pets: [],
	}))
	.case(actions.requestPets.done, (state, { result: pets }) => ({
		...state, pets,
	}))
	.case(actions.requestPets.failed, (state, { error }) => ({
		...state, error,
	}))
	.case(actions.addPet, (state, payload) => {
		return {
			...state, pets: [ payload, ...state.pets ], error: undefined,
		}
	})
