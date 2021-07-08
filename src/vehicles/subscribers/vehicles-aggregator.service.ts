import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { EventstoreService } from '../../common/eventstore/eventstore.service'
import { ElasticClientService } from '../../common/elastic/elastic-client/elastic-client.service'
import { vehicleConstants } from '../constants'
import { StoreEvent } from '../../common/eventstore/store-event'
import { VehicleAddedEventData } from '../events'
import { Vehicle } from '../entities'

@Injectable()
export class VehiclesAggregatorService implements OnApplicationBootstrap {
  constructor(
    private eventstore: EventstoreService,
    private elasticClient: ElasticClientService,
  ) {}

  onApplicationBootstrap(): any {
    return Promise.all([
      this.eventstore
        .subscribe({
          streamName: vehicleConstants.streamNames.vehicle.category, // all events for all companies
          handlers: {
            [vehicleConstants.eventTypes.vehicleAdded]: this.vehicleAdded,
          },
          subscriberId: vehicleConstants.subscriberIds.aggregates.vehicle,
        })
        .start(),
    ])
  }

  vehicleAdded = async (event: StoreEvent<VehicleAddedEventData>) => {
    const vehicle = new Vehicle({ ...event.data })
    await this.elasticClient.upsert({
      routing: event.data.companyId,
      index: vehicleConstants.indexes.vehicles,
      id: event.data.vehicleId,
      body: vehicle,
    })
  }
}
