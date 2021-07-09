import { Module } from '@nestjs/common'
import { ElasticModule } from '../common/elastic/elastic.module'
import { CompaniesModule } from '../companies/companies.module'
import { VehiclesController } from './api/vehiclesController'
import { VehiclesApiService } from './api/vehicles-api.service'
import { VehiclesAggregatorService } from './services/vehicles-aggregator.service'
import { VehiclesComponentService } from './services/vehicles-component.service'
import { VinDecodingService } from './services/vin-decoding.service'
import { VehicleProjectionService } from './services/vehicle-projection.service'

@Module({
  imports: [ElasticModule, CompaniesModule, VehicleProjectionService],
  controllers: [VehiclesController],
  providers: [
    VehiclesApiService,
    VehiclesAggregatorService,
    VehiclesComponentService,
    VehicleProjectionService,
    VinDecodingService,
  ],
  exports: [VehicleProjectionService],
})
export class VehiclesModule {}
