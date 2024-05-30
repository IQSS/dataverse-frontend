import { User } from '../../../../../src/users/domain/models/User'

export class UserMother {
  static create(): User {
    return {
      displayName: 'James D. Potts',
      persistentId: 'jamesPotts'
    }
  }
}
