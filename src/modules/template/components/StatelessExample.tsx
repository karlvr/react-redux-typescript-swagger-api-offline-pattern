/**
 * Component template.
 * 
 * Note that this file has a `.tsx` suffix, as it contains React elements.
 */

import * as React from 'react'
import { OwnProps, Props, Actions } from '../containers/Example'

export default class StatelessExample extends React.Component<OwnProps & Props & Actions> {

	render() {
		// const { exampleProperty } = this.props

		return (
			<div>
				{/* <p>{exampleProperty}</p>
				<button onClick={this.doExample}>Example</button> */}
			</div>
		)
	}

	/**
	 * An ES6 function definition. We define the function like this, rather than as per
	 * the render() function below so that it binds `this` automatically.
	 */
	// private doExample = () => {
	// 	this.props.onExample(this.state.myValue)
	// }
}
