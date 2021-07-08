import { StoreEvent } from '../../common/eventstore/store-event'
import { jsonEvent } from '@eventstore/db-client'

import { IsSuccess, Metadata } from '../../common/interfaces'
import { companyConstants } from '../constants'

export type AddCompanyCmdData = {
  companyId: string
  name: string
}

export class AddCompany extends StoreEvent<AddCompanyCmdData> {
  public completionEvents: Record<string, IsSuccess> = {
    [companyConstants.eventTypes.companyAdded]: true,
  }

  constructor(data: AddCompanyCmdData, metadata: Metadata) {
    super(
      jsonEvent({
        type: companyConstants.eventTypes.addCompany,
        data,
        metadata,
      }),
    )
  }
}
