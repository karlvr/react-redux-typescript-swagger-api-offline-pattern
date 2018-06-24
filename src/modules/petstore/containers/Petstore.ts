/**
 * Container template for a component.
 */

/* Import the component from the component path */
import Component from '../components/Petstore'

import { connect } from 'react-redux'
import { Action, Dispatch } from 'redux'

/* Import RootStoreState */
import { RootStoreState } from 'root/index'

/* Import module files */
import * as actions from '../actions'
import { Pet } from '../types'

/**
 * Interface for properties that the container passes to the component.
 */
export interface Props {
	pets: ReadonlyArray<Pet>
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
const mapStateToProps = ({ petstore }: RootStoreState): Props => {
	return {
		pets: petstore.pets,
		error: petstore.error,
	}
}

/** Populate the Actions with the callbacks for the component. */
const mapDispatchToProps = (dispatch: Dispatch<Action>): Actions => ({
	loadPets: () => {
		dispatch(actions.requestPets.started(undefined))
	},
	onAddPet: (name) => {
		dispatch(actions.addPet({
			name,
			photoUrls: [''],
		}))
	},
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
