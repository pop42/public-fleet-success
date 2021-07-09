import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { EventstoreService } from '../../common/eventstore/eventstore.service'
import { ElasticClientService } from '../../common/elastic/elastic-client/elastic-client.service'
import { AddVehicleDto } from './dto/add-vehicle.dto'
import { Utils } from '../../common/utils'
import { vehicleConstants } from '../constants'
import { Vehicle } from '../entities'
import { AddVehicle } from '../events'
import { ApiEntityResponseDto } from '../../common/dto/api-entity-response.dto'
import { CompanyProjectionService } from '../../companies/services/company-projection.service'

@Injectable()
export class VehiclesApiService {
  constructor(
    private eventstore: EventstoreService,
    private elasticClient: ElasticClientService,
    private companiesProjectionService: CompanyProjectionService,
  ) {}

  findVehicles = async (
    companyId: string,
    search: string,
    sortBy: string,
    offset: number,
    limit: number,
  ) =>
    this.elasticClient.search<Vehicle>({
      routing: companyId,
      index: vehicleConstants.indexes.vehicles,
      search,
      sortBy,
      offset,
      limit,
    })

  /**
   * Finds a single vehicle by id
   * @param companyId
   * @param id
   */
  findVehicle = async (companyId: string, id: string) =>
    this.elasticClient.fetchById<Vehicle>({
      routing: companyId,
      index: vehicleConstants.indexes.vehicles,
      id,
    })

  /**
   * Adds user to the system and to a company
   * @param addVehicleDto
   */
  addVehicle = async (addVehicleDto: AddVehicleDto) => {
    const { companyId } = addVehicleDto
    const vehicleId = Utils.suid()
    const $correlationId = Utils.suid()

    const company = await this.companiesProjectionService.loadCompany(companyId)

    if (!company) {
      throw new HttpException(
        `Company ${companyId} not found.`,
        HttpStatus.NOT_FOUND,
      )
    }

    const addVehicle = new AddVehicle(
      { ...addVehicleDto, vehicleId },
      { $correlationId },
    )

    await this.eventstore.write(
      vehicleConstants.streamNames.vehicle.commandEntity(vehicleId),
      addVehicle.eventData,
    )

    const completionEvent = await this.eventstore.waitForIt(
      $correlationId,
      addVehicle.completionEvents,
    )

    if (
      completionEvent.event.type !== vehicleConstants.eventTypes.vehicleAdded
    ) {
      throw new HttpException('Conflict', HttpStatus.CONFLICT)
    }

    return new ApiEntityResponseDto(vehicleId, $correlationId)
  }
}
