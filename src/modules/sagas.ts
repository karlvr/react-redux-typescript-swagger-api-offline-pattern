/**
 * The root saga file that defines the root saga.
 */

import { all } from 'redux-saga/effects'

/* Import module sagas */
import authSaga from './auth/sagas'
import apiSaga from './api/sagas'

/** The root saga that starts all of the other sagas. */
export default function* rootSaga() {
	yield all([
		/* The API saga */
		apiSaga(),

		/* The authentication saga */
		authSaga(),
	])
}
