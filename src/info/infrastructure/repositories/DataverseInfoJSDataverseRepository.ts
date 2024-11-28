import { getDataverseVersion, ReadError } from '@iqss/dataverse-client-javascript'
import { axiosInstance } from '@/axiosInstance'
import { DataverseInfoRepository } from '@/info/domain/repositories/DataverseInfoRepository'
import { DataverseVersion } from '@/info/domain/models/DataverseVersion'
import { TermsOfUse } from '@/info/domain/models/TermsOfUse'

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

  async getTermsOfUse() {
    //TODO - implement using js-dataverse
    const response = await axiosInstance.get<{ data: { message: TermsOfUse } }>(
      '/api/v1/info/apiTermsOfUse',
      { excludeToken: true }
    )
    return response.data.data.message
  }
}
