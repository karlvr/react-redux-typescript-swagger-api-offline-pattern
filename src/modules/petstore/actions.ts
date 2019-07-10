import actionCreatorFactory, { Action } from 'typescript-fsa'

import { Pet } from './types'
import { wrapOfflineAction } from 'modules/api/offline'
import * as Api from 'typescript-fetch-api'
import api from 'modules/api'

/**
 * The action creator for this module. Note that it contains the module name.
 */
const actionCreator = actionCreatorFactory('Petstore')

export type RequestPetsSuccessPayload = Pet[]
export type RequestPetsAction = Action<undefined>
export const requestPets = actionCreator.async<undefined, RequestPetsSuccessPayload, Error>('REQUEST_PETS')

export interface AddPetPayload {
	name: string
	photoUrls: string[]
}
export type AddPetAction = Action<AddPetPayload>
export const addPet = actionCreator<AddPetPayload>('ADD_PET')

/** Offline-capable action to add a new pet. */
export const addPetAsync = wrapOfflineAction(actionCreator.async<Api.Pet, Response, Response>('ADD_PET'), (body) => {
	return api().addPet({ body })
})