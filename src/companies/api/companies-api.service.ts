import { AddCompanyDto } from './dto/add-company.dto'
import { Utils } from '../../common/utils'
import { EventstoreService } from '../../common/eventstore/eventstore.service'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'

import { ApiEntityResponseDto } from '../../common/dto/api-entity-response.dto'
import { AddCompany } from '../events'
import { ElasticClientService } from '../../common/elastic/elastic-client/elastic-client.service'
import { Company } from '../entities'
import { companyConstants } from '../constants'

@Injectable()
export class CompaniesApiService {
  constructor(
    private eventstore: EventstoreService,
    private elasticClient: ElasticClientService,
  ) {}

  findCompany = async (id: string) =>
    this.elasticClient.fetchById<Company>({
      routing: id,
      index: companyConstants.indexes.companies,
      id,
    })

  /**
   * Adds new company
   * @param addCompanyDto
   */
  addCompany = async (addCompanyDto: AddCompanyDto) => {
    const companyId = Utils.suid()
    const $correlationId = Utils.suid()

    const addCompany = new AddCompany(
      { ...addCompanyDto, companyId },
      { $correlationId },
    )

    await this.eventstore.write(
      companyConstants.streamNames.company.commandEntity(companyId),
      addCompany.eventData,
    )

    const completionEvent = await this.eventstore.waitForIt(
      $correlationId,
      addCompany.completionEvents,
    )

    if (
      completionEvent.event.type !== companyConstants.eventTypes.companyAdded
    ) {
      throw new HttpException('Conflict', HttpStatus.CONFLICT)
    }
    return new ApiEntityResponseDto(companyId, $correlationId)
  }
}
