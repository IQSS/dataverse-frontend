import { User } from '../../../../../src/users/domain/models/User'
import { faker } from '@faker-js/faker'

export class UserMother {
  static create(): User {
    return {
      name: faker.name.fullName()
    }
  }
}
