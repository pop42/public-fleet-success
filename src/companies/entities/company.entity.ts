import { ApiProperty } from '@nestjs/swagger'

export class Company {
  @ApiProperty()
  public readonly companyId: string

  @ApiProperty()
  public readonly name: string

  constructor(params: { companyId: string; name: string }) {
    this.companyId = params.companyId
    this.name = params.name
  }
}
