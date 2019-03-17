import { reducerWithInitialState } from 'typescript-fsa-reducers'
import { combineReducers } from 'redux'

import platform from 'platform/index'
import * as a from './actions'

/* Import reducers from our modules */
import * as template from 'template/reducer'
import * as auth from 'auth/reducer'
import * as petstore from 'petstore/reducer'
// import * as another from '../another/reducers'

/**
 * The root store state. Include sub-states for all of the modules / ducks.
 */
export type StoreState = DeepReadonly<MutableStoreState>

interface MutableStoreState {
	template: template.StoreState
	auth: auth.StoreState
	petstore: petstore.StoreState

	ready: boolean
}

const readyReducer = reducerWithInitialState(false)
	.case(a.readyAction, () => true)

const reducers = platform.customiseReducers({
		template: template.reducer,
		auth: auth.reducer,
		petstore: petstore.reducer,

		ready: readyReducer,
	})

/**
 * The root reducer, combines reducers for all of the modules / ducks.
 */
export const reducer = platform.customiseRootReducer(combineReducers(reducers))
