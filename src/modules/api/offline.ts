/**
 * Redux Offline callback function implementations.
 */

import * as Api from 'typescript-fetch-api';
import { OfflineAction } from '@redux-offline/redux-offline/lib/types';
import { isType } from 'typescript-fsa';

import * as petstore from '../petstore/actions';

const pets = new Api.PetApi();

/** Wrap promise results into the result format expected by typescript-fsa async actions. */
function wrapPromise<T>(action: OfflineAction, promise: Promise<T>) {
	return promise.then(result => {
		return Promise.resolve({ params: action.payload, result });
	}).catch(error => {
		return Promise.reject({ params: action.payload, error });  
	});
}

export function handleDiscard(error: {}, action: OfflineAction, retries: number = 0) {
	/* The Swagger Codegen API throws the response in the event of an error, so we use the
	status code from the response to determine whether to discard.
	*/
	if (error instanceof Response) {
		return error.status >= 400 && error.status < 500;
	}

	/* Other errors that aren't thrown responses are always discarded. */
	return true;
}

export function handleEffect(effect: {}, action: OfflineAction): Promise<{}> {
	// TODO this can be broken down into separate module files
	if (isType(action, petstore.addPet.started)) {
		return wrapPromise(action, pets.addPet({ body: action.payload }));
	} else {
		return Promise.reject(new Error('Unsupported offline action: ' + action.type));
	}
}
