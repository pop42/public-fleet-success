import { Body, Controller, Get, Param, Post } from '@nestjs/common'

import { CompaniesApiService } from './companies-api.service'
import { ApiEntityResponseDto } from '../../common/dto/api-entity-response.dto'
import { ApiExtraModels, ApiTags } from '@nestjs/swagger'
import { AddCompanyDto } from './dto/add-company.dto'

@ApiTags('Companies')
@Controller('companies')
@ApiExtraModels(ApiEntityResponseDto)
export class CompaniesController {
  constructor(private readonly companiesApiService: CompaniesApiService) {}

  @Post()
  async addCompany(@Body() addCompanyDto: AddCompanyDto) {
    return this.companiesApiService.addCompany(addCompanyDto)
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.companiesApiService.findCompany(id)
  }
}
