/**
 * Container template for a component.
 */

/* Import the component from the component path */
import Component from '../components/Example'

import { connect } from 'react-redux'
import { Dispatch, Action } from 'redux'

/* Import RootStoreState */
import { RootStoreState } from 'modules/root/index'

/* Import module actions */
import * as a from '../actions'

/**
 * Interface for properties that this container passes to its component.
 */
export interface Props {
	exampleProperty: string
}

/**
 * Interface for properties that the parent component will pass to this container.
 */
export interface OwnProps {
	myOwnProp?: string
}

/**
 * Interface for action callbacks that this container exposes to its component.
 * The component's `this.props` is typed `Props & Actions`.
 */
export interface Actions {
	onExample: (value: string) => void
}

/** Populate the Props from the store state. */
const mapStateToProps = (state: RootStoreState, ownProps: OwnProps): Props => {
	return {
		exampleProperty: state.template.name,
	}
}

/** Populate the Actions with the callbacks for the component. */
const mapDispatchToProps = (dispatch: Dispatch<Action>, ownProps: OwnProps): Actions => ({
	onExample: (value) => {
		dispatch(a.examplePrimitivePayloadAction(value))
	},
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
