import { ZipDownloadLimit } from '@/settings/domain/models/ZipDownloadLimit'
import { DataverseVersion } from '../models/DataverseVersion'
import { TermsOfUse } from '../models/TermsOfUse'
import { Setting } from '@/settings/domain/models/Setting'

export interface DataverseInfoRepository {
  getVersion(): Promise<DataverseVersion>
  getTermsOfUse: () => Promise<TermsOfUse>
  getZipDownloadLimit: () => Promise<Setting<ZipDownloadLimit>>
  getMaxEmbargoDurationInMonths: () => Promise<Setting<number>>
}
