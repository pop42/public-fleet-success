import { Injectable } from '@nestjs/common'
import { EventstoreService } from '../../common/eventstore/eventstore.service'

import { RawEvent } from '../../common/eventstore/raw-event'
import { CompanyAddedEventData } from '../events'
import { companyConstants } from '../constants'

export interface CompanyProjection {
  id: string
  name: string
  revision: BigInt
}

const projection = {
  init() {
    return {
      id: undefined,
      name: undefined,
      revision: undefined,
    }
  },
  CompanyAdded(
    company: CompanyProjection,
    event: RawEvent<CompanyAddedEventData>,
  ) {
    company.id = event.data.companyId
    company.name = event.data.name
    company.revision = event.revision
    return company
  },
}

@Injectable()
export class CompanyProjectionService {
  constructor(private eventstore: EventstoreService) {}

  loadCompany = async (companyId: string) =>
    this.eventstore.fetch<CompanyProjection>(
      companyConstants.streamNames.company.entity(companyId),
      projection,
    )
}
