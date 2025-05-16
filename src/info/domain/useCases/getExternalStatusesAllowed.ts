import { Setting } from '@/settings/domain/models/Setting'
import { DataverseInfoRepository } from '../repositories/DataverseInfoRepository'

export function getExternalStatusesAllowed(
  dataverseInfoRepository: DataverseInfoRepository
): Promise<Setting<string[]>> {
  return dataverseInfoRepository.getExternalStatusesAllowed()
}
