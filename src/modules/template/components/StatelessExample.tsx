/**
 * Component template.
 * 
 * Note that this file has a `.tsx` suffix, as it contains React elements.
 */

import * as React from 'react'
import { OwnProps, Props, Actions } from '../containers/Example'

export default class StatelessExample extends React.Component<OwnProps & Props & Actions> {

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
