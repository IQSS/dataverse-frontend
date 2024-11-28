import { DataverseInfoMockRepository } from './DataverseInfoMockRepository'
import { DataverseVersion } from '@/info/domain/models/DataverseVersion'
import { TermsOfUse } from '@/info/domain/models/TermsOfUse'

export class DataverseInfoMockLoadingRepository implements DataverseInfoMockRepository {
  getVersion(): Promise<DataverseVersion> {
    return new Promise(() => {})
  }

  getTermsOfUse(): Promise<TermsOfUse> {
    return new Promise(() => {})
  }
}
