import { FileAccess } from '../../../../../src/files/domain/models/FileAccess'
import { faker } from '@faker-js/faker'

export class FileAccessMother {
  static create(props?: Partial<FileAccess>): FileAccess {
    return {
      restricted: faker.datatype.boolean(),
      latestVersionRestricted: faker.datatype.boolean(),
      canBeRequested: faker.datatype.boolean(),
      requested: faker.datatype.boolean(),
      ...props
    }
  }

  static createPublic(): FileAccess {
    return this.create({
      restricted: false,
      latestVersionRestricted: false,
      canBeRequested: false,
      requested: false
    })
  }

  static createRestricted(): FileAccess {
    return this.create({
      restricted: true,
      latestVersionRestricted: true,
      canBeRequested: false,
      requested: false
    })
  }

  static createNotRestrictedButLatestVersionRestricted(): FileAccess {
    return this.create({
      restricted: false,
      latestVersionRestricted: true,
      canBeRequested: false,
      requested: false
    })
  }

  static createWithAccessGranted(): FileAccess {
    return this.create({
      restricted: true,
      latestVersionRestricted: true,
      canBeRequested: true,
      requested: false
    })
  }

  static createWithAccessRequestAllowed(): FileAccess {
    return this.create({
      restricted: true,
      latestVersionRestricted: true,
      canBeRequested: true,
      requested: false
    })
  }

  static createWithAccessRequestNotAllowed(): FileAccess {
    return this.create({
      restricted: true,
      latestVersionRestricted: true,
      canBeRequested: false,
      requested: false
    })
  }

  static createWithAccessRequestPending(): FileAccess {
    return this.create({
      restricted: true,
      latestVersionRestricted: true,
      canBeRequested: true,
      requested: true
    })
  }
}
