import { InstallationMetrics } from '@/dataverse-hub/domain/models/InstallationMetrics'
import { DataverseHubMockRepository } from './DataverseHubMockRepository'

export class DataverseHubLoadingMockRepository implements DataverseHubMockRepository {
  getInstallationMetricsByHubId(_dvHubId: string): Promise<InstallationMetrics> {
    return new Promise(() => {})
  }
}
