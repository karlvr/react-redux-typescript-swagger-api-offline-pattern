import { takeEvery, call, put } from 'redux-saga/effects'
import { SagaIterator } from 'redux-saga'
import * as Api from 'typescript-fetch-api'

import * as petstore from 'modules/petstore/actions'
import * as actions from './actions'

const pets = new Api.PetApi()

/** Handle an API get request */
function* handleRequestPets(action: petstore.RequestPetsAction): SagaIterator {
	try {
		let result: Api.Pet[] = yield call(() => {
			return pets.findPetsByStatus({ status: [Api.FindPetsByStatusStatusEnum.Available] })
		})

		yield put(petstore.requestPets.done({ params: action.payload, result }))
	} catch (error) {
		yield put(petstore.requestPets.failed({ params: action.payload, error }))
	}
}

/** Handle an API update request that we're going to support offline. */
function* handleAddPet(action: petstore.AddPetAction): SagaIterator {
	/* Dispatch our offline API action to persist the request represented by the received action. */
	yield put(actions.addPetAsync.started(action.payload))
}

export default function* saga(): SagaIterator {
	yield takeEvery(petstore.requestPets.started, handleRequestPets)
	yield takeEvery(petstore.addPet, handleAddPet)
}
