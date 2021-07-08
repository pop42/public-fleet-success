import { StoreEvent } from '../../common/eventstore/store-event'
import { Metadata } from '../../common/interfaces'
import { jsonEvent } from '@eventstore/db-client'
import { AddUserCmdData } from './add-user'
import { userConstants } from '../constants'

export type UserAddedEventData = AddUserCmdData

export class UserAdded extends StoreEvent<UserAddedEventData> {
  constructor(data: UserAddedEventData, metadata: Metadata) {
    super(
      jsonEvent({ type: userConstants.eventTypes.userAdded, data, metadata }),
    )
  }
}
