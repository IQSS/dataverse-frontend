import { DataverseVersion } from '../models/DataverseVersion'
import { TermsOfUse } from '../models/TermsOfUse'

export interface DataverseInfoRepository {
  getVersion(): Promise<DataverseVersion>
  getTermsOfUse: () => Promise<TermsOfUse>
  getZipDownloadLimit: () => Promise<number>
  getMaxEmbargoDurationInMonths: () => Promise<number>
}
