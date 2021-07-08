import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { EventstoreService } from '../../common/eventstore/eventstore.service'
import { StoreEvent } from '../../common/eventstore/store-event'
import { userConstants } from '../constants'
import { AddUserCmdData, UserAdded } from '../events'
import { UserProjectionService } from '../projections/user-projection.service'

@Injectable()
export class UsersComponentService implements OnApplicationBootstrap {
  constructor(
    private eventstore: EventstoreService,
    private userProjectionService: UserProjectionService,
  ) {}

  onApplicationBootstrap(): any {
    return Promise.all([
      this.eventstore
        .subscribe({
          streamName: userConstants.streamNames.user.commandCategory,
          handlers: {
            [userConstants.eventTypes.addUser]: this.addUser,
          },
          subscriberId: userConstants.subscriberIds.components.userCommand, // a unique name
        })
        .start(),
    ])
  }

  addUser = async (event: StoreEvent<AddUserCmdData>) => {
    const user = await this.userProjectionService.loadUser(event.data.userId)
    if (!user) {
      const newEvent = new UserAdded(event.data, event.metadata)
      await this.eventstore.write(
        userConstants.streamNames.user.entity(event.data.userId),
        newEvent.eventData,
      )
    }
  }
}
