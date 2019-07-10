/**
 * Container template for a component.
 */

/* Import the component from the component path */
import Component from '../components/Petstore'

import { connect } from 'react-redux'
import { Action, Dispatch } from 'redux'

/* Import RootStoreState */
import { RootStoreState } from 'modules/root'

/* Import module files */
import * as a from '../actions'
import { Pet } from '../types'

/**
 * Interface for properties that the container passes to the component.
 */
export interface Props {
	pets: DeepReadonly<Pet[]>
	error?: Error
}

/**
 * Interface for action callbacks that the container exposes to the component.
 * The component's `this.props` is typed `Props & Actions`.
 */
export interface Actions {
	loadPets: () => void
	onAddPet: (name: string) => void
}

/** Populate the Props from the store state. */
const mapStateToProps = (state: RootStoreState): Props => {
	return {
		pets: state.petstore.pets,
		error: state.petstore.error,
	}
}

/** Populate the Actions with the callbacks for the component. */
const mapDispatchToProps = (dispatch: Dispatch<Action>): Actions => ({
	loadPets: () => {
		dispatch(a.requestPets.started(undefined))
	},
	onAddPet: (name) => {
		dispatch(a.addPet({
			name,
			photoUrls: [''],
		}))
	},
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
