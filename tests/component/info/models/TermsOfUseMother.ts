import { faker } from '@faker-js/faker'
import isChromatic from 'chromatic/isChromatic'
import { TermsOfUse } from '@/info/domain/models/TermsOfUse'

export class TermsOfUseMother {
  static create(): TermsOfUse {
    return isChromatic() ? 'https://some-terms-of-use-url.com' : faker.lorem.paragraphs(8)
  }

  static createEmpty(): TermsOfUse {
    return 'There are no API Terms of Use for this Dataverse installation.'
  }
}
