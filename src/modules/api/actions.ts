import { actionCreatorFactory } from 'typescript-fsa'

const actionCreator = actionCreatorFactory('API')

/** Action fired when the app goes online. */
export const onlineAction = actionCreator('ONLINE')
