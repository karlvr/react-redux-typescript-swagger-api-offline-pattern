import { actionCreatorFactory } from 'typescript-fsa'
import * as Api from 'typescript-fetch-api'
import api from './'

import { wrapOfflineAction } from './offline'

const actionCreator = actionCreatorFactory('API')

/** Offline-capable action to add a new pet. */
export const addPet = wrapOfflineAction(actionCreator.async<Api.Pet, Response, Response>('ADD_PET'), (payload) => {
	return api.addPet(payload)
})

/** Action fired when the app goes online. */
export const onlineAction = actionCreator('ONLINE')
