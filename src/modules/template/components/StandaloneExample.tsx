/**
 * Component template.
 * 
 * Note that this file has a `.tsx` suffix, as it contains React elements.
 */

import * as React from 'react'

interface ComponentOwnProps {
	exampleProperty: string
}

/**
 * Interface for private internal component state.
 */
type State = DeepReadonly<{
	myValue: string
}>

/**
 * The initial state for our internal component state.
 */
const INITIAL_STATE: State = {
	myValue: 'Example',
}

export default class StandaloneExample extends React.Component<ComponentOwnProps, State> {

	public state = INITIAL_STATE

	public render() {
		// const { exampleProperty } = this.props

		return (
			<div>
				{/* <p>{exampleProperty}</p>
				<button onClick={this.doExample}>Example</button> */}
			</div>
		)
	}

	// private doExample = () => {
	// 	this.props.onExample(this.state.myValue)
	// }
}
