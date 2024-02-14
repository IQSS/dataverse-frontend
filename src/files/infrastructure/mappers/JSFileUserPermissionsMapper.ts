import { FileUserPermissions } from '../../domain/models/FileUserPermissions'

export class JSFileUserPermissionsMapper {
  static toFileUserPermissions(
    jsFileId: number,
    jsFileUserPermissions: {
      canDownloadFile: boolean
      canEditOwnerDataset: boolean
    }
  ): FileUserPermissions {
    return {
      fileId: jsFileId,
      canDownloadFile: jsFileUserPermissions.canDownloadFile,
      canEditDataset: jsFileUserPermissions.canEditOwnerDataset
    }
  }
}
