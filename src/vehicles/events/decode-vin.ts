import { IsSuccess, Metadata } from '../../common/interfaces'
import { jsonEvent } from '@eventstore/db-client'
import { StoreEvent } from '../../common/eventstore/store-event'
import { vehicleConstants } from '../constants'

export type DecodeVinCmdData = {
  vehicleId: string
  vin: string
}

export class DecodeVin extends StoreEvent<DecodeVinCmdData> {
  public completionEvents: Record<string, IsSuccess> = {
    [vehicleConstants.eventTypes.vinDecoded]: true,
    [vehicleConstants.eventTypes.decodeVinFailed]: true,
  }

  constructor(data: DecodeVinCmdData, metadata: Metadata) {
    super(
      jsonEvent({
        type: vehicleConstants.eventTypes.decodeVin,
        data,
        metadata,
      }),
    )
  }
}
