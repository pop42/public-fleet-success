import { Module } from '@nestjs/common'
import { UsersController } from './api/users.controller'
import { UsersApiService } from './api/users-api.service'
import { ElasticModule } from '../common/elastic/elastic.module'
import { CompaniesModule } from '../companies/companies.module'
import { UsersAggregatorService } from './services/users-aggregator.service'
import { UsersComponentService } from './services/users-component.service'
import { UserProjectionService } from './services/user-projection.service'

@Module({
  imports: [ElasticModule, CompaniesModule, UserProjectionService],
  controllers: [UsersController],
  providers: [
    UsersApiService,
    UsersAggregatorService,
    UsersComponentService,
    UserProjectionService,
  ],
  exports: [UserProjectionService],
})
export class UsersModule {}
