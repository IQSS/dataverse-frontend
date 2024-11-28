import { User } from '../../../../../src/users/domain/models/User'

export class UserMother {
  static create(): User {
    return {
      displayName: 'James D. Potts',
      persistentId: 'jamesPotts',
      firstName: 'James',
      lastName: 'Potts',
      email: 'jamesPotts@g.harvard.edu',
      affiliation: 'Harvard University',
      superuser: false,
      identifier: 'jamespotts'
    }
  }
  static createSuperUser(): User {
    return {
      persistentId: 'admin',
      superuser: true,
      displayName: 'James D. Potts',
      firstName: 'James',
      lastName: 'Potts',
      email: 'jamesPotts@g.harvard.edu',
      affiliation: 'Harvard University',
      identifier: 'jamespotts'
    }
  }
}
