import { DataverseInfoRepository } from '../repositories/DataverseInfoRepository'
import { DataverseVersion } from '../models/DataverseVersion'

export function getDataverseVersion(
  dataverseInfoRepository: DataverseInfoRepository
): Promise<DataverseVersion> {
  return dataverseInfoRepository.getVersion()
}
