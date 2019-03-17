/**
 * Component template.
 * 
 * Note that this file has a `.tsx` suffix, as it contains React elements.
 */

import * as React from 'react'
import { Props, Actions, OwnProps } from '../containers/Example'

/**
 * Interface for private internal component state.
 */
type State = DeepReadonly<{
	myValue: string
	myOtherValue: string
	myDeepValue: {
		aString: string
		aNumber: number
	}
}>

/**
 * The initial state for our internal component state.
 */
const INITIAL_STATE: State = {
	myValue: 'Example',
	myOtherValue: 'Another value',
	myDeepValue: {
		aString: 'abc',
		aNumber: 33,
	}
}

export default class Example extends React.Component<OwnProps & Props & Actions, State> {

	state = INITIAL_STATE

	render() {
		const { exampleProperty } = this.props

		return (
			<div>
				<p>{exampleProperty}</p>
				<button onClick={this.doExample}>Example</button>
			</div>
		)
	}

	/**
	 * An ES6 function definition. We define the function like this, rather than as per
	 * the render() function below so that it binds `this` automatically.
	 */
	private doExample = () => {
		this.props.onExample(this.state.myValue)

		this.setState({
			myValue: 'Ok',
			myDeepValue: {
				...this.state.myDeepValue,
				aNumber: 35,
			}
		})
	}
}
