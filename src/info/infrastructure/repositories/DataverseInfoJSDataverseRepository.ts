import { getDataverseVersion, WriteError } from 'js-dataverse'
import { DataverseInfoRepository } from '../../domain/repositories/DataverseInfoRepository'
import { DataverseVersion } from '../../domain/models/DataverseVersion'

interface JSDataverseDataverseVersion {
  number: string
  build: string
}

export class DataverseInfoJSDataverseRepository implements DataverseInfoRepository {
  static formatVersion(jsDataverseDataverseVersion: JSDataverseDataverseVersion): DataverseVersion {
    return `v. ${jsDataverseDataverseVersion.number} build ${jsDataverseDataverseVersion.build}`
  }
  getVersion(): Promise<DataverseVersion> {
    return getDataverseVersion
      .execute()
      .then((jsDataverseDataverseVersion: JSDataverseDataverseVersion) =>
        DataverseInfoJSDataverseRepository.formatVersion(jsDataverseDataverseVersion)
      )
      .catch((error: WriteError) => {
        throw new Error(error.message)
      })
  }
}
