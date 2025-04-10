import { DataverseVersion } from '@/info/domain/models/DataverseVersion'
import { TermsOfUse } from '@/info/domain/models/TermsOfUse'
import { DataverseInfoRepository } from '@/info/domain/repositories/DataverseInfoRepository'
import { DataverseVersionMother } from '@tests/component/info/models/DataverseVersionMother'
import { TermsOfUseMother } from '@tests/component/info/models/TermsOfUseMother'

export class DataverseInfoMockRepository implements DataverseInfoRepository {
  getVersion(): Promise<DataverseVersion> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(DataverseVersionMother.create())
      }, 1_000)
    })
  }

  getTermsOfUse(): Promise<TermsOfUse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(TermsOfUseMother.create())
      }, 1_000)
    })
  }
}
