import { type TermsOfUse } from '../../../info/domain/models/TermsOfUse'
import { DataverseInfoRepository } from '../repositories/DataverseInfoRepository'

export function getApiTermsOfUse(
  dataverseInfoRepository: DataverseInfoRepository
): Promise<TermsOfUse> {
  return dataverseInfoRepository.getApiTermsOfUse().catch((error) => {
    throw error
  })
}
