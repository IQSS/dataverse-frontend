import {
  getApplicationTermsOfUse,
  getDataverseVersion,
  ReadError
} from '@iqss/dataverse-client-javascript'
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

  getTermsOfUse(): Promise<TermsOfUse> {
    return getApplicationTermsOfUse
      .execute()
      .then((termsOfUse) => JSTermsOfUseMapper.toSanitizedTermsOfUse(termsOfUse))
  }
}
