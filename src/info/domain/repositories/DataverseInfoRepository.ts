import { DataverseVersion } from '../models/DataverseVersion'
import { TermsOfUse } from '../models/TermsOfUse'

export interface DataverseInfoRepository {
  getVersion(): Promise<DataverseVersion>
  getApiTermsOfUse: () => Promise<TermsOfUse>
}
