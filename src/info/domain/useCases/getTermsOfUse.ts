import { type TermsOfUse } from '../../../info/domain/models/TermsOfUse'
import { DataverseInfoRepository } from '../repositories/DataverseInfoRepository'

export function getTermsOfUse(
  dataverseInfoRepository: DataverseInfoRepository
): Promise<TermsOfUse> {
  return dataverseInfoRepository.getTermsOfUse().catch((error) => {
    throw error
  })
}
