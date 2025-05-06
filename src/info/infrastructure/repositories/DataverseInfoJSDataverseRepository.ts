import {
  getDataverseVersion,
  getMaxEmbargoDurationInMonths,
  getZipDownloadLimit,
  ReadError
} from '@iqss/dataverse-client-javascript'
import { axiosInstance } from '@/axiosInstance'
import { DataverseInfoRepository } from '@/info/domain/repositories/DataverseInfoRepository'
import { DataverseVersion } from '@/info/domain/models/DataverseVersion'
import { TermsOfUse } from '@/info/domain/models/TermsOfUse'
import { JSTermsOfUseMapper } from '../mappers/JSTermsOfUseMapper'

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
    //TODO - This is not actually used and should be replaced with a js-dataverse use case when we have available the endpoint to get the installation terms of use not api terms of use.
    const response = await axiosInstance.get<{ data: { message: TermsOfUse } }>(
      '/api/v1/info/apiTermsOfUse',
      { excludeToken: true }
    )
    return JSTermsOfUseMapper.toSanitizedTermsOfUse(response.data.data.message)
  }

  getZipDownloadLimit(): Promise<number> {
    return getZipDownloadLimit.execute().then((zipDownloadLimit) => zipDownloadLimit)
  }

  getMaxEmbargoDurationInMonths(): Promise<number> {
    return getMaxEmbargoDurationInMonths
      .execute()
      .then((maxEmbargoDurationInMonths) => maxEmbargoDurationInMonths)
  }
}
