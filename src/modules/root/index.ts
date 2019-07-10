import { StoreState as RootStoreState } from './reducer'
import { Store } from 'redux'

export type RootStoreState = RootStoreState

let _store: Store<RootStoreState>

export function getStore() {
	return _store
}

export function setStore(store: Store<RootStoreState>) {
	_store = store
}
