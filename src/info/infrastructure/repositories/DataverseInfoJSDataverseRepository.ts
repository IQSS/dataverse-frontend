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
import { ZipDownloadLimit } from '@/settings/domain/models/ZipDownloadLimit'
import { FileSizeUnit } from '@/files/domain/models/FileMetadata'
import { Setting, SettingName } from '@/settings/domain/models/Setting'

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

  getZipDownloadLimit(): Promise<Setting<ZipDownloadLimit>> {
    return getZipDownloadLimit.execute().then((zipDownloadLimit) => ({
      name: SettingName.ZIP_DOWNLOAD_LIMIT,
      value: new ZipDownloadLimit(zipDownloadLimit, FileSizeUnit.BYTES)
    }))
  }

  getMaxEmbargoDurationInMonths(): Promise<Setting<number>> {
    return getMaxEmbargoDurationInMonths
      .execute()
      .then((maxEmbargoDurationInMonths) => ({
        name: SettingName.MAX_EMBARGO_DURATION_IN_MONTHS,
        value: maxEmbargoDurationInMonths
      }))
      .catch(() => {
        // https://guides.dataverse.org/en/latest/installation/config.html#maxembargodurationinmonths
        // In case of error, we default to 0 which indicates embargoes are not supported.
        return {
          name: SettingName.MAX_EMBARGO_DURATION_IN_MONTHS,
          value: 0
        }
      })
  }
}
