import { Metadata } from '../../common/interfaces'
import { StoreEvent } from '../../common/eventstore/store-event'
import { vehicleConstants } from '../constants'
import { jsonEvent } from '@eventstore/db-client'

export type VinDecodedEventData = Record<string, unknown> & {
  errorCode: string
  errorText: string
  make: string
  model: string
  modelYear: string
}

export class VinDecoded extends StoreEvent<VinDecodedEventData> {
  constructor(data: VinDecodedEventData, metadata: Metadata) {
    super(
      jsonEvent({
        type: vehicleConstants.eventTypes.vinDecoded,
        data,
        metadata,
      }),
    )
  }
}
