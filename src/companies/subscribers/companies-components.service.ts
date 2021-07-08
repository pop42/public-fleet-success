import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { EventstoreService } from '../../common/eventstore/eventstore.service'
import { StoreEvent } from '../../common/eventstore/store-event'
import { CompanyProjectionService } from '../projections/company-projection.service'

import { AddCompanyCmdData, CompanyAdded } from '../events'
import { companyConstants } from '../constants'

@Injectable()
export class CompaniesComponentsService implements OnApplicationBootstrap {
  constructor(
    private eventstore: EventstoreService,
    private companiesProjectionService: CompanyProjectionService,
  ) {}

  onApplicationBootstrap(): any {
    return Promise.all([
      this.eventstore
        .subscribe({
          streamName: companyConstants.streamNames.company.commandCategory,
          handlers: {
            [companyConstants.eventTypes.addCompany]: this.addCompany,
          },
          subscriberId:
            companyConstants.subscriberIds.components.companyCommand, // a unique name
        })
        .start(),
    ])
  }

  addCompany = async (event: StoreEvent<AddCompanyCmdData>) => {
    const company = await this.companiesProjectionService.loadCompany(
      event.data.companyId,
    )
    if (!company) {
      const newEvent = new CompanyAdded(event.data, event.metadata)
      await this.eventstore.write(
        companyConstants.streamNames.company.entity(event.data.companyId),
        newEvent.eventData,
      )
    }
  }
}
