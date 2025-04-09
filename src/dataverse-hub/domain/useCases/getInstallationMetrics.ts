import { DataverseHubRepository } from '../repositories/DataverseHubRepository'
import { InstallationMetrics } from '../models/InstallationMetrics'

export async function getInstallationMetrics(
  dataverseHubRepository: DataverseHubRepository,
  dvHubId: string
): Promise<InstallationMetrics> {
  return dataverseHubRepository.getInstallationMetricsByHubId(dvHubId)
}
