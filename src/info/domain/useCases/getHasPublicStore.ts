import { Setting } from '@/settings/domain/models/Setting'
import { DataverseInfoRepository } from '../repositories/DataverseInfoRepository'

export function getHasPublicStore(
  dataverseInfoRepository: DataverseInfoRepository
): Promise<Setting<boolean>> {
  return dataverseInfoRepository.getHasPublicStore()
}
