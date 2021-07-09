import { RawEvent } from '../../common/eventstore/raw-event'
import { UserAddedEventData } from '../events'
import { Injectable } from '@nestjs/common'
import { EventstoreService } from '../../common/eventstore/eventstore.service'
import { userConstants } from '../constants'

export interface UserProjection {
  id: string
  firstName: string
  lastName: string
  email: string
  mobilePhone: string
  companyId: string
  revision: BigInt
}

const projection = {
  init() {
    return {
      id: undefined,
      firstName: undefined,
      lastName: undefined,
      email: undefined,
      mobilePhone: undefined,
      companyId: undefined,
      revision: undefined,
    }
  },
  UserAdded(user: UserProjection, event: RawEvent<UserAddedEventData>) {
    user.id = event.data.userId
    user.firstName = event.data.firstName
    user.lastName = event.data.lastName
    user.email = event.data.email
    user.mobilePhone = event.data.mobilePhone
    user.companyId = event.data.companyId
    user.revision = event.revision
    return user
  },
}

@Injectable()
export class UserProjectionService {
  constructor(private eventstore: EventstoreService) {}

  loadUser = async (userId: string) =>
    this.eventstore.fetch<UserProjection>(
      userConstants.streamNames.user.entity(userId),
      projection,
    )
}
