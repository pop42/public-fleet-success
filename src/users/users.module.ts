import { Module } from '@nestjs/common'
import { UsersController } from './api/users.controller'
import { UsersApiService } from './api/users-api.service'
import { ElasticModule } from '../common/elastic/elastic.module'
import { CompaniesModule } from '../companies/companies.module'
import { UsersAggregatorsService } from './subscribers/users-aggregators.service'
import { UsersComponentService } from './subscribers/users-component.service'
import { UserProjectionService } from './projections'

@Module({
  imports: [ElasticModule, CompaniesModule, UserProjectionService],
  controllers: [UsersController],
  providers: [
    UsersApiService,
    UsersAggregatorsService,
    UsersComponentService,
    UserProjectionService,
  ],
  exports: [UserProjectionService],
})
export class UsersModule {}
