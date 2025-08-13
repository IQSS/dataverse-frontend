import { FileAccess } from '../../domain/models/FileAccess'

export class JSFileAccessMapper {
  static toFileAccess(jsFileRestricted: boolean, jsFileRequestAccess: boolean): FileAccess {
    return {
      restricted: jsFileRestricted,
      // TODO - Implement the rest of the properties when they are added to js-dataverse
      latestVersionRestricted: false,
      canBeRequested: jsFileRequestAccess,
      requested: false
    }
  }
}
