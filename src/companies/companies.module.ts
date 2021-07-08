import { Module } from '@nestjs/common'
import { CompaniesComponentsService } from './subscribers/companies-components.service'

import { CompaniesAggregatorsService } from './subscribers/companies-aggregators.service'
import { ElasticModule } from '../common/elastic/elastic.module'
import { CompaniesController } from './api/companies.controller'
import { CompaniesApiService } from './api/companies-api.service'
import { CompanyProjectionService } from './projections'

@Module({
  imports: [ElasticModule, CompanyProjectionService],
  providers: [
    CompaniesComponentsService,
    CompaniesApiService,
    CompanyProjectionService,
    CompaniesAggregatorsService,
  ],
  controllers: [CompaniesController],
  exports: [CompanyProjectionService],
})
export class CompaniesModule {}
