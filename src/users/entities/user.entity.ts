import { ApiProperty } from '@nestjs/swagger'

export class User {
  @ApiProperty()
  public readonly companyId: string

  @ApiProperty()
  public readonly firstName: string

  @ApiProperty()
  public readonly lastName: string

  @ApiProperty()
  public readonly email?: string

  @ApiProperty()
  public readonly mobilePhone?: string

  @ApiProperty()
  public readonly userId: string

  constructor(params: {
    userId: string
    companyId: string
    firstName: string
    lastName: string
    email?: string
    mobilePhone?: string
  }) {
    this.userId = params.userId
    this.companyId = params.companyId
    this.firstName = params.firstName
    this.lastName = params.lastName
    this.email = params.email
    this.mobilePhone = params.mobilePhone
  }
}
