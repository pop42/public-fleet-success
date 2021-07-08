import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { EventstoreService } from '../../common/eventstore/eventstore.service'
import { StoreEvent } from '../../common/eventstore/store-event'
import { VehicleProjectionService } from '../projections'
import { vehicleConstants } from '../constants'
import { AddVehicleCmdData, VehicleAdded } from '../events'

@Injectable()
export class VehiclesComponentService implements OnApplicationBootstrap {
  constructor(
    private eventstore: EventstoreService,
    private vehicleProjectionService: VehicleProjectionService,
  ) {}

  onApplicationBootstrap(): any {
    return Promise.all([
      this.eventstore
        .subscribe({
          streamName: vehicleConstants.streamNames.vehicle.commandCategory,
          handlers: {
            [vehicleConstants.eventTypes.addVehicle]: this.addVehicle,
          },
          subscriberId:
            vehicleConstants.subscriberIds.components.vehicleCommand, // a unique name
        })
        .start(),
    ])
  }

  addVehicle = async (event: StoreEvent<AddVehicleCmdData>) => {
    const vehicle = await this.vehicleProjectionService.loadVehicle(
      event.data.vehicleId,
    )
    if (!vehicle) {
      const newEvent = new VehicleAdded(event.data, event.metadata)
      await this.eventstore.write(
        vehicleConstants.streamNames.vehicle.entity(event.data.vehicleId),
        newEvent.eventData,
      )
    }
  }
}
