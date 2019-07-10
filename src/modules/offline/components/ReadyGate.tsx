/**
 * Component that blocks the application rendering until the store is ready.
 * This prevents us from rendering state, or from making any decisions until the store
 * is ready. Ready means it has restored its persistent state using redux-persist / redux-offline.
 */

import * as React from 'react'
import { Props, Actions } from '../containers/ReadyGate'

/**
 * Interface for private internal component state.
 */
interface State {

}

/**
 * The initial state for our internal component state.
 */
const INITIAL_STATE: State = {

}

export default class ReadyGate extends React.Component<Props & Actions, State> {

	public state = INITIAL_STATE

	public render() {
		const { ready, waitComponent: WaitComponent, ...rest } = this.props

		if (ready) {
			return this.props.children
		} else {
			return (
				<WaitComponent {...rest} />
			)
		}
	}
}
