import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import './index.css'
import { init } from 'root'

init().then(() => {
	ReactDOM.render(
		<App />,
		document.getElementById('root') as HTMLElement
	)
})

registerServiceWorker()
