import { actionCreatorFactory } from 'typescript-fsa';

/** Action creator factory for root actions. */
const actionCreator = actionCreatorFactory();

/** Action dispatched when the app state is ready (has been rehydrated) */
export const readyAction = actionCreator('READY');
