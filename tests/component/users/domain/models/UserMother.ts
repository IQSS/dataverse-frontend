import { User } from '../../../../../src/users/domain/models/User'
import { faker } from '@faker-js/faker'
import isChromatic from 'chromatic/isChromatic'
export class UserMother {
  static create(): User {
    return {
      name: isChromatic() ? 'James D. Potts' : faker.name.fullName()
    }
  }
}
