import actionCreatorFactory from 'typescript-fsa'

import { Pet } from './types'
import { wrapOfflineAction, OfflineActionGenericError } from 'modules/api/offline'
import * as Api from 'typescript-fetch-api'
import api from 'modules/api'

/**
 * The action creator for this module. Note that it contains the module name.
 */
const actionCreator = actionCreatorFactory('Petstore')

export type RequestPetsSuccessPayload = Pet[]
export const requestPets = actionCreator.async<undefined, RequestPetsSuccessPayload, Error>('REQUEST_PETS')
export type RequestPetsAction = ReturnType<typeof requestPets.started>

export interface AddPetPayload {
	name: string
	photoUrls: string[]
}
export const addPet = actionCreator<AddPetPayload>('ADD_PET')
export type AddPetAction = ReturnType<typeof addPet>

/** Offline-capable action to add a new pet. */
export const addPetAsync = wrapOfflineAction(actionCreator.async<Api.Pet, boolean, OfflineActionGenericError>('ADD_PET'), async (body) => {
	await api().addPet({ body })
	return true
})
