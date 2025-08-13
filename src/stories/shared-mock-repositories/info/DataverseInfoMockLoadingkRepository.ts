import { DataverseInfoMockRepository } from './DataverseInfoMockRepository'
import { DataverseVersion } from '@/info/domain/models/DataverseVersion'
import { TermsOfUse } from '@/info/domain/models/TermsOfUse'
import { Setting } from '@/settings/domain/models/Setting'
import { ZipDownloadLimit } from '@/settings/domain/models/ZipDownloadLimit'

export class DataverseInfoMockLoadingRepository implements DataverseInfoMockRepository {
  getVersion(): Promise<DataverseVersion> {
    return new Promise(() => {})
  }

  getTermsOfUse(): Promise<TermsOfUse> {
    return new Promise(() => {})
  }

  getZipDownloadLimit(): Promise<Setting<ZipDownloadLimit>> {
    return new Promise(() => {})
  }

  getMaxEmbargoDurationInMonths(): Promise<Setting<number>> {
    return new Promise(() => {})
  }

  getHasPublicStore(): Promise<Setting<boolean>> {
    return new Promise(() => {})
  }

  getExternalStatusesAllowed(): Promise<Setting<string[]>> {
    return new Promise(() => {})
  }
}
