import { FileAccess } from '../../domain/models/FileAccess'

export class JSFileAccessMapper {
  static toFileAccess(
    jsFileRestricted: boolean,
    jsFileRequestAccess: boolean | undefined
  ): FileAccess {
    return {
      restricted: jsFileRestricted,
      // TODO - Implement the rest of the properties when they are added to js-dataverse
      latestVersionRestricted: false,
      canBeRequested: jsFileRequestAccess ?? false,
      requested: false
    }
  }
}
