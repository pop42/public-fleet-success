import { RawEvent } from '../../common/eventstore/raw-event'
import { VehicleAddedEventData } from '../events'
import { Injectable } from '@nestjs/common'
import { EventstoreService } from '../../common/eventstore/eventstore.service'
import { vehicleConstants } from '../constants'
import { VinDecodedEventData } from '../events/vin-decoded'

export interface VehicleProjection {
  id: string
  name: string
  vin: string
  facilityId: string
  year: string
  make: string
  model: string
  companyId: string
  isVinDecoded: boolean
  vinData: Record<string, unknown>
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
      isVinDecoded: false,
      vinData: undefined,
      revision: undefined,
    }
  },
  VehicleAdded(
    vehicle: VehicleProjection,
    event: RawEvent<VehicleAddedEventData>,
  ) {
    vehicle.id = event.data.vehicleId
    vehicle.name = event.data.name
    vehicle.companyId = event.data.companyId
    vehicle.facilityId = event.data.facilityId
    vehicle.vin = event.data.vin
    vehicle.revision = event.revision
    return vehicle
  },
  VinDecoded(vehicle: VehicleProjection, event: RawEvent<VinDecodedEventData>) {
    vehicle.isVinDecoded = true
    vehicle.vinData = event.data
    vehicle.year = event.data.modelYear
    vehicle.make = event.data.make
    vehicle.model = event.data.model
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
