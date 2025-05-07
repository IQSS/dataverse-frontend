import { DataverseVersion } from '@/info/domain/models/DataverseVersion'
import { TermsOfUse } from '@/info/domain/models/TermsOfUse'
import { FakerHelper } from '@tests/component/shared/FakerHelper'
import { DataverseInfoMockRepository } from './DataverseInfoMockRepository'

export class DataverseInfoMockErrorRepository implements DataverseInfoMockRepository {
  getVersion(): Promise<DataverseVersion> {
    return new Promise((_resolve, reject) => {
      setTimeout(() => {
        reject()
      }, FakerHelper.loadingTimout())
    })
  }

  getTermsOfUse(): Promise<TermsOfUse> {
    return new Promise((_resolve, reject) => {
      setTimeout(() => {
        reject()
      }, FakerHelper.loadingTimout())
    })
  }
}
