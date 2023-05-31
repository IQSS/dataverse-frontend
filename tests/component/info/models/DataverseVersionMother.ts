import { faker } from '@faker-js/faker'
import { DataverseVersion } from '../../../../src/info/domain/models/DataverseVersion'
import isChromatic from 'chromatic/isChromatic'
export class DataverseVersionMother {
  static create(): DataverseVersion {
    return isChromatic()
      ? 'v. 123 build 12345'
      : `v. ${faker.datatype.number()} build ${faker.datatype.number()}`
  }
}
