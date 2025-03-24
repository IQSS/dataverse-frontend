import { FilePermissions } from '../../domain/models/FilePermissions'
import { FileUserPermissions as JSFilePermissions } from '@iqss/dataverse-client-javascript'

export class JSFilePermissionsMapper {
  static toFilePermissions(jsFileUserPermissions: JSFilePermissions): FilePermissions {
    return {
      canDownloadFile: jsFileUserPermissions.canDownloadFile,
      canManageFilePermissions: jsFileUserPermissions.canManageFilePermissions,
      canEditOwnerDataset: jsFileUserPermissions.canEditOwnerDataset
    }
  }
}
