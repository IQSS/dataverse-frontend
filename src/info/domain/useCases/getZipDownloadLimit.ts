import { ZipDownloadLimit } from '@/settings/domain/models/ZipDownloadLimit'
import { DataverseInfoRepository } from '../repositories/DataverseInfoRepository'
import { Setting } from '@/settings/domain/models/Setting'

export function getZipDownloadLimit(
  dataverseInfoRepository: DataverseInfoRepository
): Promise<Setting<ZipDownloadLimit>> {
  return dataverseInfoRepository.getZipDownloadLimit()
}
