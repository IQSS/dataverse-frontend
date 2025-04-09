import { InstallationMetrics } from '@/dataverse-hub/domain/models/InstallationMetrics'
import { DataverseHubRepository } from '@/dataverse-hub/domain/repositories/DataverseHubRepository'
import { InstallationMetricsMother } from '@tests/component/dataverse-hub/domain/models/InstallationMetricsMother'
import { FakerHelper } from '@tests/component/shared/FakerHelper'

export class DataverseHubMockRepository implements DataverseHubRepository {
  getInstallationMetricsByHubId(_dvHubId: string): Promise<InstallationMetrics> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(InstallationMetricsMother.createInstallationMetrics())
      }, FakerHelper.loadingTimout())
    })
  }
}
