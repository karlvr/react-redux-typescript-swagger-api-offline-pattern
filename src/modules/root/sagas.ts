/**
 * The root saga file that defines the root saga.
 */

import { all } from 'redux-saga/effects'

/* Import module sagas */
import authSaga from '@modules/auth/sagas'
import apiSaga from '@modules/api/sagas'
import platformSaga from '@modules/platform/sagas'

/** The root saga that starts all of the other sagas. */
export default function* rootSaga() {
	yield all([
		apiSaga(),
		authSaga(),
		platformSaga(),
	])
}
