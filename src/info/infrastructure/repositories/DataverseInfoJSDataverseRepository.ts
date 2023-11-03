import { getDataverseVersion, ReadError } from '@iqss/dataverse-client-javascript'
import { DataverseInfoRepository } from '../../domain/repositories/DataverseInfoRepository'
import { DataverseVersion } from '../../domain/models/DataverseVersion'

interface JSDataverseDataverseVersion {
  number: string
  build: string
}

export class DataverseInfoJSDataverseRepository implements DataverseInfoRepository {
  static formatVersion(jsDataverseDataverseVersion: JSDataverseDataverseVersion): DataverseVersion {
    const buildFormatted = jsDataverseDataverseVersion.build
      ? `build ${jsDataverseDataverseVersion.build}`
      : ''

    return `v. ${jsDataverseDataverseVersion.number} ${buildFormatted}`
  }

  getVersion(): Promise<DataverseVersion> {
    return getDataverseVersion
      .execute()
      .then((jsDataverseDataverseVersion: JSDataverseDataverseVersion) =>
        DataverseInfoJSDataverseRepository.formatVersion(jsDataverseDataverseVersion)
      )
      .catch((error: ReadError) => {
        throw new Error(error.message)
      })
  }
}
