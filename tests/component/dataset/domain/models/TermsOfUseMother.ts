import { faker } from '@faker-js/faker'
import { DatasetTermsOfUse } from '@/dataset/domain/models/Dataset'
import { CustomTerms } from '@/dataset/domain/models/Dataset'
import { TermsOfAccess } from '@/dataset/domain/models/Dataset'

export class TermsOfAccessMother {
  static create(props?: Partial<TermsOfAccess>): TermsOfAccess {
    const defaultTerms: TermsOfAccess = {
      termsOfAccessForRestrictedFiles: faker.lorem.sentence(
        faker.datatype.number({ min: 1, max: 100 })
      ),
      fileAccessRequest: faker.datatype.boolean(),
      dataAccessPlace: faker.lorem.sentence(faker.datatype.number({ min: 1, max: 100 })),
      originalArchive: faker.lorem.sentence(faker.datatype.number({ min: 1, max: 100 })),
      availabilityStatus: faker.lorem.sentence(faker.datatype.number({ min: 1, max: 100 })),
      contactForAccess: faker.internet.email(),
      sizeOfCollection: `${faker.datatype.number({ min: 1, max: 100 })} GB`,
      studyCompletion: faker.date.past().toISOString().split('T')[0]
    }

    return { ...defaultTerms, ...props }
  }

  static createEmpty(): TermsOfAccess {
    return {
      fileAccessRequest: false,
      dataAccessPlace: undefined,
      originalArchive: undefined,
      availabilityStatus: undefined,
      contactForAccess: undefined,
      sizeOfCollection: undefined,
      studyCompletion: undefined,
      termsOfAccessForRestrictedFiles: undefined
    }
  }

  static createRealistic(props?: Partial<TermsOfAccess>): TermsOfAccess {
    const defaultTerms: TermsOfAccess = {
      termsOfAccessForRestrictedFiles: 'Restricted files require special access permissions.',
      fileAccessRequest: true,
      dataAccessPlace: 'Data can be accessed at the main office.',
      originalArchive: 'Original archive is available upon request.',
      availabilityStatus: 'Available for research purposes.',
      contactForAccess: 'foo@bar.com',
      sizeOfCollection: '50 GB',
      studyCompletion: '2023-10-01'
    }
    return { ...defaultTerms, ...props }
  }
}

export class CustomTermsMother {
  static create(props?: Partial<CustomTerms>): CustomTerms {
    const defaultTerms: CustomTerms = {
      termsOfUse: faker.lorem.sentence(faker.datatype.number({ min: 1, max: 100 })),
      confidentialityDeclaration: faker.lorem.sentence(faker.datatype.number({ min: 1, max: 100 })),
      specialPermissions: faker.lorem.sentence(faker.datatype.number({ min: 1, max: 100 })),
      restrictions: faker.lorem.sentence(faker.datatype.number({ min: 1, max: 100 })),
      citationRequirements: faker.lorem.sentence(faker.datatype.number({ min: 1, max: 100 })),
      depositorRequirements: faker.lorem.sentence(faker.datatype.number({ min: 1, max: 100 })),
      conditions: faker.lorem.sentence(faker.datatype.number({ min: 1, max: 100 })),
      disclaimer: faker.lorem.sentence(faker.datatype.number({ min: 1, max: 100 }))
    }

    return { ...defaultTerms, ...props }
  }
}

export class TermsOfUseMother {
  static create(props?: Partial<DatasetTermsOfUse>): DatasetTermsOfUse {
    const defaultTerms: DatasetTermsOfUse = {
      termsOfAccess: TermsOfAccessMother.create(),
      customTerms: CustomTermsMother.create()
    }
    return { ...defaultTerms, ...props }
  }

  static withoutCustomTerms(props?: Partial<DatasetTermsOfUse>): DatasetTermsOfUse {
    const defaultTerms: DatasetTermsOfUse = {
      termsOfAccess: TermsOfAccessMother.create(),
      customTerms: undefined
    }
    return { ...defaultTerms, ...props }
  }

  static createRealistic(props?: Partial<DatasetTermsOfUse>): DatasetTermsOfUse {
    const defaultTerms: DatasetTermsOfUse = {
      termsOfAccess: TermsOfAccessMother.create(),
      customTerms: CustomTermsMother.create()
    }
    return { ...defaultTerms, ...props }
  }
}
