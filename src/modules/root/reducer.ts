import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { combineReducers } from 'redux';

import * as actions from './actions';

/* Import reducers from our modules */
import * as template from '../template/reducer';
import * as auth from '../auth/reducer';
import * as petstore from '../petstore/reducer';
// import * as another from '../another/reducers';

/**
 * The root store state. Include sub-states for all of the modules / ducks.
 * All of these should be annotated `readonly`, as should everything down
 * the tree of StoreState interfaces, and their contents.
 */
export interface StoreState {
	readonly template: template.StoreState;
	readonly auth: auth.StoreState;
	readonly petstore: petstore.StoreState;

	readonly ready: boolean;
}

const readyReducer = reducerWithInitialState(false)
	.case(actions.readyAction, (state, payload) => (true))
	;

/**
 * The root reducer, combines reducers for all of the modules / ducks.
 */
export const reducer = combineReducers<StoreState>({
	template: template.reducer,
	auth: auth.reducer,
	petstore: petstore.reducer,

	ready: readyReducer,
});
