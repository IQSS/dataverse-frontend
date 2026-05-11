import { Setting } from '@/settings/domain/models/Setting'
import { DataverseInfoRepository } from '../repositories/DataverseInfoRepository'

export function getDatasetPublishPopupCustomText(
  dataverseInfoRepository: DataverseInfoRepository
): Promise<Setting<string>> {
  return dataverseInfoRepository.getDatasetPublishPopupCustomText()
}
