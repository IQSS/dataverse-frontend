import { User } from '../../../src/domain/User'
import { faker } from '@faker-js/faker'

export class UserMother {
  static create(): User {
    return {
      name: faker.name.fullName()
    }
  }
}
