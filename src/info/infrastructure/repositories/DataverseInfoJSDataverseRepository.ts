import {
  getApplicationTermsOfUse,
  getDataverseVersion,
  getMaxEmbargoDurationInMonths,
  getZipDownloadLimit,
  ReadError
} from '@iqss/dataverse-client-javascript'
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

  getTermsOfUse(): Promise<TermsOfUse> {
    return getApplicationTermsOfUse
      .execute()
      .then((termsOfUse) => JSTermsOfUseMapper.toSanitizedTermsOfUse(termsOfUse))
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

  // TODO - make js-dataverse use case for this
  getHasPublicStore(): Promise<Setting<boolean>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          name: SettingName.HAS_PUBLIC_STORE,
          value: false
        })
      }, 1000)
    })
  }

  // TODO - make js-dataverse use case for this
  getExternalStatusesAllowed(): Promise<Setting<string[]>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          name: SettingName.ALLOWED_EXTERNAL_STATUSES,
          value: [
            'Author Contacted',
            'Privacy Review',
            'Awaiting Paper Publication',
            'Final Approval'
          ]
        })
      }, 1000)
    })
  }
}
