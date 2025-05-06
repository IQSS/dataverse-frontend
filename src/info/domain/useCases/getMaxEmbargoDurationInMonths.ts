import { DataverseInfoRepository } from '../repositories/DataverseInfoRepository'

export function getMaxEmbargoDurationInMonths(
  dataverseInfoRepository: DataverseInfoRepository
): Promise<number> {
  return dataverseInfoRepository.getMaxEmbargoDurationInMonths()
}
