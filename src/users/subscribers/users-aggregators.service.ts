import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { EventstoreService } from '../../common/eventstore/eventstore.service'
import { StoreEvent } from '../../common/eventstore/store-event'

import { ElasticClientService } from '../../common/elastic/elastic-client/elastic-client.service'
import { userConstants } from '../constants'
import { UserAddedEventData } from '../events'
import { User } from '../entities'

@Injectable()
export class UsersAggregatorsService implements OnApplicationBootstrap {
  constructor(
    private eventstore: EventstoreService,
    private elasticClient: ElasticClientService,
  ) {}

  onApplicationBootstrap(): any {
    return Promise.all([
      this.eventstore
        .subscribe({
          streamName: userConstants.streamNames.user.category, // all events for all companies
          handlers: {
            [userConstants.eventTypes.userAdded]: this.userAdded,
          },
          subscriberId: userConstants.subscriberIds.aggregates.user,
        })
        .start(),
    ])
  }

  userAdded = async (event: StoreEvent<UserAddedEventData>) => {
    const user = new User({ ...event.data })
    await this.elasticClient.upsert({
      routing: event.data.companyId,
      index: userConstants.indexes.users,
      id: event.data.userId,
      body: user,
    })
  }
}
