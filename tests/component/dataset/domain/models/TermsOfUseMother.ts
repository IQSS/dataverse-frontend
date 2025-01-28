import { faker } from '@faker-js/faker'
import { DatasetTermsOfUse } from '../../../../../src/dataset/domain/models/Dataset'

export class TermsOfUseMother {
  static create(props?: Partial<DatasetTermsOfUse>): DatasetTermsOfUse {
    const defaultTerms: DatasetTermsOfUse = {
      termsOfAccess: faker.lorem.sentence(faker.datatype.number({ min: 1, max: 100 })),
      fileAccessRequest: true,
      dataAccessPlace: faker.lorem.sentence(faker.datatype.number({ min: 1, max: 100 })),
      originalArchive: faker.lorem.sentence(faker.datatype.number({ min: 1, max: 100 })),
      availabilityStatus: faker.lorem.sentence(faker.datatype.number({ min: 1, max: 100 })),
      contactForAccess: 'support@example.com',
      sizeOfCollection: '10 GB',
      studyCompletion: '2023-01-01'
    }

    return { ...defaultTerms, ...props }
  }
}
