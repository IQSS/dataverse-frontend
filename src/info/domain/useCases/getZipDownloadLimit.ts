import { DataverseInfoRepository } from '../repositories/DataverseInfoRepository'

export function getZipDownloadLimit(
  dataverseInfoRepository: DataverseInfoRepository
): Promise<number> {
  return dataverseInfoRepository.getZipDownloadLimit()
}
