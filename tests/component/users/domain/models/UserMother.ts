import { User } from '../../../../../src/users/domain/models/User'

export class UserMother {
  static create(): User {
    return {
      name: 'James D. Potts',
      persistentId: 'jamesPotts',
      superuser: false
    }
  }
  static createSuperUser(): User {
    return {
      name: 'James D. Superuser',
      persistentId: 'admin',
      superuser: true
    }
  }
}
