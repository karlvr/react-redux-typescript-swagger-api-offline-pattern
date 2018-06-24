import * as React from 'react'
import { Provider } from 'react-redux'

import { store } from 'root/index'

import './App.css'
import Example from 'template/containers/Example'
import Login from 'auth/containers/Login'
import Petstore from 'petstore/containers/Petstore'
import ReadyGate from 'offline/containers/ReadyGate'

const logo = require('./logo.svg')

class Waiting extends React.Component {
	render() {
		return (
			<div>
				<p>Loading&hellip;</p>
			</div>
		)
	}
}

class App extends React.Component {
	render() {
		return (
			<Provider store={store}>
				<ReadyGate waitComponent={Waiting}>
					<div className="App">
						<div className="App-header">
							<img src={logo} className="App-logo" alt="logo" />
							<h2>Welcome to React</h2>
						</div>
						<Login />
						<Example />
						<Petstore />
					</div>
				</ReadyGate>
			</Provider>
		)
	}
}

export default App
