import { IsSuccess, Metadata } from '../../common/interfaces'
import { jsonEvent } from '@eventstore/db-client'
import { StoreEvent } from '../../common/eventstore/store-event'
import { vehicleConstants } from '../constants'

export type AddVehicleCmdData = {
  companyId: string
  name: string
  vehicleId: string
  facilityId: string
  vin: string
}

export class AddVehicle extends StoreEvent<AddVehicleCmdData> {
  public completionEvents: Record<string, IsSuccess> = {
    [vehicleConstants.eventTypes.vehicleAdded]: true,
  }

  constructor(data: AddVehicleCmdData, metadata: Metadata) {
    super(
      jsonEvent({
        type: vehicleConstants.eventTypes.addVehicle,
        data,
        metadata,
      }),
    )
  }
}
