/**
 * Container template for a component.
 */

/* Import the component from the component path */
import Component from '../components/ReadyGate'

import { connect } from 'react-redux'
import { Dispatch, Action } from 'redux'

/* Import RootStoreState */
import { RootStoreState } from 'root/index'

/**
 * Interface for properties that the container passes to the component.
 */
export interface Props {
	ready: boolean
	waitComponent: React.ComponentType
}

export interface OwnProps {
	/** The component to render while we wait for the app to be ready. */
	waitComponent: React.ComponentType
}

/**
 * Interface for action callbacks that the container exposes to the component.
 * The component's `this.props` is typed `Props & Actions`.
 */
export interface Actions {

}

/** Populate the Props from the store state. */
const mapStateToProps = ({ ready }: RootStoreState, { waitComponent }: OwnProps): Props => {
	return {
		ready,
		waitComponent,
	}
}

/** Populate the Actions with the callbacks for the component. */
const mapDispatchToProps = (dispatch: Dispatch<Action>): Actions => ({
	// onExample: (value) => {
	// 	dispatch(actions.examplePrimitiveAction(value))
	// },
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
