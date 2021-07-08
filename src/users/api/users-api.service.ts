import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { AddUserDto } from './dto/add-user.dto'
import { Utils } from '../../common/utils'
import { EventstoreService } from '../../common/eventstore/eventstore.service'
import { ElasticClientService } from '../../common/elastic/elastic-client/elastic-client.service'
import { AddUser } from '../events'
import { userConstants } from '../constants'
import { ApiEntityResponseDto } from '../../common/dto/api-entity-response.dto'
import { CompanyProjectionService } from '../../companies/projections/company-projection.service'
import { User } from '../entities'

@Injectable()
export class UsersApiService {
  constructor(
    private eventstore: EventstoreService,
    private elasticClient: ElasticClientService,
    private companiesProjectionService: CompanyProjectionService,
  ) {}

  findUsers = async (
    companyId: string,
    search: string,
    sortBy: string,
    offset: number,
    limit: number,
  ) =>
    this.elasticClient.search<User>({
      routing: companyId,
      index: userConstants.indexes.users,
      search,
      sortBy,
      offset,
      limit,
    })

  /**
   * Finds a single user by id
   * @param companyId
   * @param id
   */
  findUser = async (companyId: string, id: string) =>
    this.elasticClient.fetchById<User>({
      routing: companyId,
      index: userConstants.indexes.users,
      id,
    })

  /**
   * Adds user to the system and to a company
   * @param addUserDto
   */
  addUser = async (addUserDto: AddUserDto) => {
    const { companyId } = addUserDto
    const userId = Utils.suid()
    const $correlationId = Utils.suid()

    const company = await this.companiesProjectionService.loadCompany(companyId)

    if (!company) {
      throw new HttpException(
        `Company ${companyId} not found.`,
        HttpStatus.NOT_FOUND,
      )
    }

    const addUser = new AddUser({ ...addUserDto, userId }, { $correlationId })

    await this.eventstore.write(
      userConstants.streamNames.user.commandEntity(userId),
      addUser.eventData,
    )

    const completionEvent = await this.eventstore.waitForIt(
      $correlationId,
      addUser.completionEvents,
    )

    if (completionEvent.event.type !== userConstants.eventTypes.userAdded) {
      throw new HttpException('Conflict', HttpStatus.CONFLICT)
    }

    return new ApiEntityResponseDto(userId, $correlationId)
  }
}
