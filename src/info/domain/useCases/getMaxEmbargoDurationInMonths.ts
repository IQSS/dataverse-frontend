import { Setting } from '@/settings/domain/models/Setting'
import { DataverseInfoRepository } from '../repositories/DataverseInfoRepository'

export function getMaxEmbargoDurationInMonths(
  dataverseInfoRepository: DataverseInfoRepository
): Promise<Setting<number>> {
  return dataverseInfoRepository.getMaxEmbargoDurationInMonths()
}
