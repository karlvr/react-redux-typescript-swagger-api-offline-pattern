/**
 * Component template.
 * 
 * Note that this file has a `.tsx` suffix, as it contains React elements.
 */

import * as React from 'react'
import { Props, Actions } from '../containers/Login'

/**
 * Interface for private internal component state.
 */
interface State {
	username: string
	password: string
	rememberMe: boolean
}

/**
 * The initial state for our internal component state.
 */
const INITIAL_STATE: State = {
	username: '',
	password: '',
	rememberMe: false,
}

export default class Login extends React.Component<Props & Actions, State> {

	public state = INITIAL_STATE

	public render() {
		const { loggedIn, error } = this.props

		return (
			<div>
				{loggedIn ? (
					<div>
						<p>Logged in</p>
						<button onClick={this.doLogout}>Logout</button>
					</div>
				) : (
					<div>
						<p>
							<input
								type="text"
								name="username"
								placeholder="Username"
								onChange={this.handleUsername}
								value={this.state.username}
							/>
							<input
								type="password"
								name="password"
								onChange={this.handlePassword}
								defaultValue={this.state.password}
							/>
							<button onClick={this.doLogin}>Login</button>
						</p>
					</div>
				)}
				{error && (
					<div>{error.message}</div>
				)}
			</div>
		)
	}

	private doLogin = () => {
		this.props.onLogin(this.state)
	}

	private doLogout = () => {
		this.props.onLogout()
	}

	private handleUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({
			username: e.target.value,
		})
	}

	private handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({
			password: e.target.value,
		})
	}

	private handleRememberMe = (e: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({
			rememberMe: e.target.checked,
		})
	}
}
