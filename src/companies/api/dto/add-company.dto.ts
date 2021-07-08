import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class AddCompanyDto {
  @ApiProperty({description: "Name of company",example: "Barber of Fleet Street"})
  @IsString()
  readonly name: string
}
