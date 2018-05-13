import { ActionCreator, AsyncActionCreators, Meta, Action } from 'typescript-fsa';

type GenericActionCreatorFunction = ((result: {}) => ({}));

export function wrapOfflineAction<P, B, C>(action: AsyncActionCreators<P, B, C>): AsyncActionCreators<P, B, C> {
	let newActionStartedCreator = function (payload: P, meta?: Meta): Action<P> {
		let result = action.started(payload, meta);
		result.meta = {
			...result.meta,
			offline: {
				commit: (action.done as GenericActionCreatorFunction)({ params: payload, result: undefined }),
				rollback: (action.failed as GenericActionCreatorFunction)({ params: payload, result: {} }),
			}
		};
		return result;
	};

	let newAction = newActionStartedCreator as ActionCreator<P>;
	newAction.type = action.started.type;
	newAction.match = action.started.match;

	return {
		type: action.type,
		started: newAction,
		done: action.done,
		failed: action.failed,
	};
}
