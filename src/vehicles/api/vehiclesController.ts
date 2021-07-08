import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { ApiExtraModels, ApiTags } from '@nestjs/swagger'
import { ApiEntityResponseDto } from '../../common/dto/api-entity-response.dto'
import { VehiclesApiService } from './vehicles-api.service'
import { AddVehicleDto } from './dto/add-vehicle.dto'

@Controller(':companyId/vehicles')
@ApiExtraModels(ApiEntityResponseDto)
@ApiTags('Vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesApiService: VehiclesApiService) {}

  @Post()
  async addVehicle(
    @Body() addVehicleDto: AddVehicleDto,
    @Param('companyId') companyId: string,
  ) {
    return this.vehiclesApiService.addVehicle({ ...addVehicleDto, companyId })
  }

  @Get(':id')
  async findOne(
    @Param('companyId') companyId: string,
    @Param('id') id: string,
  ) {
    return this.vehiclesApiService.findVehicle(companyId, id)
  }

  @Get()
  async findMany(
    @Param('companyId') companyId: string,
    @Param('id') id: string,
    @Query('search') search: string,
    @Query('sortBy') sortBy: string,
    @Query('offset') offset: number,
    @Query('limit') limit: number,
  ) {
    return this.vehiclesApiService.findVehicles(
      companyId,
      search,
      sortBy,
      offset || 0,
      limit || 1000,
    )
  }
}
