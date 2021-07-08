import { AddVehicleCmdData } from './add-vehicle'
import { Metadata } from '../../common/interfaces'
import { StoreEvent } from '../../common/eventstore/store-event'
import { vehicleConstants } from '../constants'
import { jsonEvent } from '@eventstore/db-client'

export type VehicleAddedEventData = AddVehicleCmdData

export class VehicleAdded extends StoreEvent<VehicleAddedEventData> {
  constructor(data: VehicleAddedEventData, metadata: Metadata) {
    super(
      jsonEvent({
        type: vehicleConstants.eventTypes.vehicleAdded,
        data,
        metadata,
      }),
    )
  }
}
