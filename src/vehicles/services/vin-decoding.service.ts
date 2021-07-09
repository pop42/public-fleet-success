import { Injectable } from '@nestjs/common'
import { NHTSA } from '@shaggytools/nhtsa-api-wrapper'
import * as _ from 'lodash'

@Injectable()
export class VinDecodingService {
  private readonly client: NHTSA

  constructor() {
    this.client = new NHTSA()
  }

  decodeVin = async (vin: string) => {
    const { Results } = await this.client.DecodeVinValuesExtended(vin)
    return _.mapKeys(Results[0], (v, k) => _.camelCase(k))
  }
}
