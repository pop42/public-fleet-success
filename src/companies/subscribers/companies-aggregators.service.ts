import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { EventstoreService } from '../../common/eventstore/eventstore.service'
import { StoreEvent } from '../../common/eventstore/store-event'

import { Company } from '../entities'
import { ElasticClientService } from '../../common/elastic/elastic-client/elastic-client.service'
import { companyConstants } from '../constants'
import { CompanyAddedEventData } from '../events'

@Injectable()
export class CompaniesAggregatorsService implements OnApplicationBootstrap {
  constructor(
    private eventstore: EventstoreService,
    private elasticClient: ElasticClientService,
  ) {}

  onApplicationBootstrap(): any {
    return Promise.all([
      this.eventstore
        .subscribe({
          streamName: companyConstants.streamNames.company.category, // all events for all companies
          handlers: {
            [companyConstants.eventTypes.companyAdded]: this.companyAdded,
          },
          subscriberId: companyConstants.subscriberIds.aggregates.company,
        })
        .start(),
    ])
  }

  companyAdded = async (event: StoreEvent<CompanyAddedEventData>) => {
    const company = new Company({ ...event.data })
    await this.elasticClient.upsert({
      routing: event.data.companyId,
      index: companyConstants.indexes.companies,
      id: event.data.companyId,
      body: company,
    })
  }
}
