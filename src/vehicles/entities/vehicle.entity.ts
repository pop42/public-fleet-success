import { ApiProperty } from '@nestjs/swagger'

export class Vehicle {
  @ApiProperty()
  public readonly vehicleId: string

  @ApiProperty()
  public readonly companyId: string

  @ApiProperty()
  public readonly name: string

  @ApiProperty()
  public readonly facilityId: string

  @ApiProperty()
  public readonly vin: string

  @ApiProperty()
  public make?: string

  @ApiProperty()
  public model?: string

  @ApiProperty()
  public year?: string

  constructor(params: {
    vehicleId: string
    companyId: string
    name: string
    facilityId: string
    vin: string
  }) {
    this.vehicleId = params.vehicleId
    this.companyId = params.companyId
    this.name = params.name
    this.facilityId = params.facilityId
    this.vin = params.vin
  }
}
