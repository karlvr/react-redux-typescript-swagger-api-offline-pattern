import React from 'react'
import logo from './logo.svg'
import './App.css'
import { Provider } from 'react-redux'
import ReadyGate from 'modules/offline/containers/ReadyGate'
import Login from 'modules/auth/containers/Login'
import Example from 'modules/template/containers/Example'
import Petstore from 'modules/petstore/containers/Petstore'
import { getStore } from 'modules/root'

const Waiting: React.FC = () => {
	return (
		<div>
			<p>Loading&hellip;</p>
		</div>
	)
}

const App: React.FC = () => {
	return (
		<Provider store={getStore()}>
			<ReadyGate waitComponent={Waiting}>
				<div className="App">
					<header className="App-header">
						<img src={logo} className="App-logo" alt="logo" />
						<p>
              Edit <code>src/App.tsx</code> and save to reload.
						</p>
						<a
							className="App-link"
							href="https://reactjs.org"
							target="_blank"
							rel="noopener noreferrer"
						>
              Learn React
						</a>
					</header>
					<Login />
					<Example />
					<Petstore />
				</div>
			</ReadyGate>
		</Provider>
	)
}

export default App
