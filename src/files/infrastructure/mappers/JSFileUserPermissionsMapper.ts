import { FileUserPermissions as JSFileUserPermissions } from '@iqss/dataverse-client-javascript'
import { FileUserPermissions } from '../../domain/models/FileUserPermissions'

export class JSFileUserPermissionsMapper {
  static toFileUserPermissions(
    jsFileId: number,
    jsFileUserPermissions: JSFileUserPermissions
  ): FileUserPermissions {
    return {
      fileId: jsFileId,
      canDownloadFile: jsFileUserPermissions.canDownloadFile,
      canEditDataset: jsFileUserPermissions.canEditOwnerDataset
    }
  }
}
