import {
  HttpException,
  HttpStatus,
  Injectable,
  OnApplicationBootstrap,
} from '@nestjs/common'
import { EventstoreService } from '../../common/eventstore/eventstore.service'
import { StoreEvent } from '../../common/eventstore/store-event'
import { vehicleConstants } from '../constants'
import { AddVehicleCmdData, VehicleAdded } from '../events'
import { DecodeVin, DecodeVinCmdData } from '../events/decode-vin'
import { VehicleProjectionService } from './vehicle-projection.service'
import { VinDecodingService } from './vin-decoding.service'
import { RawEvent } from '../../common/eventstore/raw-event'
import { VinDecoded, VinDecodedEventData } from '../events/vin-decoded'

@Injectable()
export class VehiclesComponentService implements OnApplicationBootstrap {
  constructor(
    private eventstore: EventstoreService,
    private vehicleProjectionService: VehicleProjectionService,
    private vinDecodingService: VinDecodingService,
  ) {}

  onApplicationBootstrap(): any {
    return Promise.all([
      this.eventstore
        .subscribe({
          streamName: vehicleConstants.streamNames.vehicle.commandCategory,
          handlers: {
            [vehicleConstants.eventTypes.addVehicle]: this.addVehicle,
            [vehicleConstants.eventTypes.decodeVin]: this.decodeVin,
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
      const decodeEvent = new DecodeVin(
        { vin: event.data.vin, vehicleId: event.data.vehicleId },
        { ...event.metadata },
      )
      await this.eventstore.write(
        vehicleConstants.streamNames.vehicle.commandEntity(
          event.data.vehicleId,
        ),
        decodeEvent.eventData,
      )
    }
  }

  decodeVin = async (event: RawEvent<DecodeVinCmdData>) => {
    const vehicle = await this.vehicleProjectionService.loadVehicle(
      event.data.vehicleId,
    )

    if (!vehicle) {
      throw new HttpException(
        `Vehicle: ${event.data.vehicleId} not found.`,
        HttpStatus.NOT_FOUND,
      )
    }

    if (vehicle.isVinDecoded) {
      return
    }

    const results = (await this.vinDecodingService.decodeVin(
      event.data.vin,
    )) as VinDecodedEventData

    const vinDecoded = new VinDecoded(results, { $correlationId: '123' })

    await this.eventstore.write(
      vehicleConstants.streamNames.vehicle.entity(event.data.vehicleId),
      vinDecoded.eventData,
    )
  }
}
