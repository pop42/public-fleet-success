import { RawEvent } from '../../common/eventstore/raw-event'
import { VehicleAddedEventData } from '../events'
import { Injectable } from '@nestjs/common'
import { EventstoreService } from '../../common/eventstore/eventstore.service'
import { vehicleConstants } from '../constants'

export interface VehicleProjection {
  id: string
  name: string
  vin: string
  facilityId: string
  year: string
  make: string
  model: string
  companyId: string
  revision: BigInt
}

const projection = {
  init() {
    return {
      id: undefined,
      name: undefined,
      vin: undefined,
      facilityId: undefined,
      year: undefined,
      make: undefined,
      model: undefined,
      companyId: undefined,
      revision: undefined,
    }
  },
  VehicleAdded(
    vehicle: VehicleProjection,
    event: RawEvent<VehicleAddedEventData>,
  ) {
    vehicle.id = event.data.vehicleId
    vehicle.companyId = event.data.companyId
    vehicle.facilityId = event.data.facilityId
    vehicle.vin = event.data.vin
    vehicle.revision = event.revision
    return vehicle
  },
}

@Injectable()
export class VehicleProjectionService {
  constructor(private eventstore: EventstoreService) {}

  loadVehicle = async (vehicleId: string) =>
    this.eventstore.fetch<VehicleProjection>(
      vehicleConstants.streamNames.vehicle.entity(vehicleId),
      projection,
    )
}
