import { IsSuccess, Metadata } from '../../common/interfaces'
import { jsonEvent } from '@eventstore/db-client'
import { StoreEvent } from '../../common/eventstore/store-event'
import { userConstants } from '../constants'

export type AddUserCmdData = {
  companyId: string
  firstName: string
  lastName: string
  email?: string
  mobilePhone?: string
  userId: string
}

export class AddUser extends StoreEvent<AddUserCmdData> {
  public completionEvents: Record<string, IsSuccess> = {
    [userConstants.eventTypes.userAdded]: true,
  }

  constructor(data: AddUserCmdData, metadata: Metadata) {
    super(jsonEvent({ type: userConstants.eventTypes.addUser, data, metadata }))
  }
}
