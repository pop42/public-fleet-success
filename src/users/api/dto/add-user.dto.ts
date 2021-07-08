import { ApiHideProperty } from '@nestjs/swagger'
import { IsEmail, IsPhoneNumber, IsString, ValidateIf } from 'class-validator'

export class AddUserDto {
  @IsString()
  readonly firstName: string

  @IsString()
  readonly lastName: string

  /**
   * The user's email.
   * Either email or mobilePhone is required.
   */
  @ValidateIf((o) => o.mobilePhone === null || o.mobile === undefined)
  @IsEmail()
  readonly email?: string

  /**
   * The user's mobilePhone.
   * Either email or mobilePhone is required.
   * @example +14802807277
   */
  @IsPhoneNumber()
  readonly mobilePhone?: string

  @ApiHideProperty()
  readonly companyId: string
}
