import { StoreEvent } from '../../common/eventstore/store-event'
import { jsonEvent } from '@eventstore/db-client'
import { Metadata } from '../../common/interfaces'

import { AddCompanyCmdData } from './add-company'
import { companyConstants } from '../constants'

export type CompanyAddedEventData = AddCompanyCmdData

export class CompanyAdded extends StoreEvent<CompanyAddedEventData> {
  constructor(data: CompanyAddedEventData, metadata: Metadata) {
    super(
      jsonEvent({
        type: companyConstants.eventTypes.companyAdded,
        data,
        metadata,
      }),
    )
  }
}
