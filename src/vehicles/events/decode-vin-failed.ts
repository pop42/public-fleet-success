import { Metadata } from '../../common/interfaces'
import { StoreEvent } from '../../common/eventstore/store-event'
import { vehicleConstants } from '../constants'
import { jsonEvent } from '@eventstore/db-client'
import { DecodeVinCmdData } from './decode-vin'

export type DecodeVinFailedEventData = DecodeVinCmdData

export class DecodeVinFailed extends StoreEvent<DecodeVinFailedEventData> {
  constructor(data: DecodeVinFailedEventData, metadata: Metadata) {
    super(
      jsonEvent({
        type: vehicleConstants.eventTypes.decodeVinFailed,
        data,
        metadata,
      }),
    )
  }
}
