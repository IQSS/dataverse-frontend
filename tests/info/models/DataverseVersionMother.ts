import { faker } from '@faker-js/faker'
import { DataverseVersion } from '../../../src/info/domain/models/DataverseVersion'

export class DataverseVersionMother {
  static create(): DataverseVersion {
    return `v. ${faker.datatype.number()} build ${faker.datatype.number()}`
  }
}
