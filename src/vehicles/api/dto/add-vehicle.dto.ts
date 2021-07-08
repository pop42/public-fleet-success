import { ApiHideProperty } from '@nestjs/swagger'
import { IsEmail, IsPhoneNumber, IsString, ValidateIf } from 'class-validator'

export class AddVehicleDto {
  @IsString()
  readonly name: string

  @IsString()
  readonly facilityId: string

  @IsString()
  readonly vin: string

  @ApiHideProperty()
  readonly companyId: string
}
