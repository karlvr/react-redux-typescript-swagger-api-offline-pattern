import { AppState } from '@redux-offline/redux-offline/lib/types'
import { RootStoreState } from '..'

export function offlineOutboxQueueLength(state: RootStoreState): number {
	const appState = (state as {}) as AppState
	return appState.offline.outbox.length
}

export function online(state: RootStoreState): boolean {
	const appState = (state as {}) as AppState
	return appState.offline.online
}
