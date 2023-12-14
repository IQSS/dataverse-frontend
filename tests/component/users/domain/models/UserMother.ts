import { User } from '../../../../../src/users/domain/models/User'

export class UserMother {
  static create(): User {
    return {
      name: 'James D. Potts',
      persistentId: 'jamesPotts'
    }
  }
}
