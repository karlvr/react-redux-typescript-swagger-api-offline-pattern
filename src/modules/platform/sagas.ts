import { SagaIterator } from 'redux-saga'
import { call } from 'redux-saga/effects'

import sagas from './impl/sagas'

export default function* (): SagaIterator {
	yield call(sagas)
}
