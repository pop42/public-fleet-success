import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { ApiExtraModels, ApiTags } from '@nestjs/swagger'
import { ApiEntityResponseDto } from '../../common/dto/api-entity-response.dto'
import { UsersApiService } from './users-api.service'
import { AddUserDto } from './dto/add-user.dto'

@Controller(':companyId/users')
@ApiExtraModels(ApiEntityResponseDto)
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersApiService: UsersApiService) {}

  @Post()
  async addUser(
    @Body() addUserDto: AddUserDto,
    @Param('companyId') companyId: string,
  ) {
    return this.usersApiService.addUser({ ...addUserDto, companyId })
  }

  @Get(':id')
  async findOne(
    @Param('companyId') companyId: string,
    @Param('id') id: string,
  ) {
    return this.usersApiService.findUser(companyId, id)
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
    return this.usersApiService.findUsers(
      companyId,
      search,
      sortBy,
      offset || 0,
      limit || 1000,
    )
  }
}
