import { InstallationMetrics } from '../models/InstallationMetrics'

export interface DataverseHubRepository {
  getInstallationMetricsByHubId: (dvHubId: string) => Promise<InstallationMetrics>
}
