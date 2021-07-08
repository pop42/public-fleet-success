import { Module } from '@nestjs/common'
import { ElasticModule } from '../common/elastic/elastic.module'
import { CompaniesModule } from '../companies/companies.module'
import { VehiclesController } from './api/vehiclesController'
import { VehiclesApiService } from './api/vehicles-api.service'
import { VehicleProjectionService } from './projections'
import { VehiclesAggregatorService } from './subscribers/vehicles-aggregator.service'
import { VehiclesComponentService } from './subscribers/vehicles-component.service'

@Module({
  imports: [ElasticModule, CompaniesModule, VehicleProjectionService],
  controllers: [VehiclesController],
  providers: [
    VehiclesApiService,
    VehiclesAggregatorService,
    VehiclesComponentService,
    VehicleProjectionService,
  ],
  exports: [VehicleProjectionService],
})
export class VehiclesModule {}
