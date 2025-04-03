import { InstallationMetrics } from '@/dataverse-hub/domain/models/InstallationMetrics'
import { DataverseHubRepository } from '@/dataverse-hub/domain/repositories/DataverseHubRepository'
import { ApiInstallationMetrics } from '../models/ApiInstallationMetrics'
import { ApiDataverseMetricsMapper } from '../mappers/ApiDataverseMetricsMapper'

// Swagger documentation: https://hub.dataverse.org/

export class ApiDataverseHubRepository implements DataverseHubRepository {
  static readonly DATAVERSE_HUB_API_URL = 'https://hub.dataverse.org/api'

  // TODO:ME - Compute and return last month downloads and last month deposited files. And last month datasets

  getInstallationMetricsByHubId(dvHubId: string): Promise<InstallationMetrics> {
    // We need to get the last two months of metrics to get the last month results also
    const now = new Date()
    now.setMonth(now.getMonth() - 1)
    const fromDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

    console.log({ fromDate })

    return fetch(
      `${ApiDataverseHubRepository.DATAVERSE_HUB_API_URL}/installation/metrics/monthly?dvHubId=${dvHubId}&fromDate=${fromDate}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error fetching metrics: ${response.statusText}`)
        }
        return response.json()
      })
      .then((apiMetrics: ApiInstallationMetrics[]) => {
        console.log(apiMetrics)
        if (apiMetrics.length === 0 || apiMetrics[0].metrics.length === 0) {
          throw new Error(`No metrics found for the given dvHubId: ${dvHubId}`)
        }

        const metrics = ApiDataverseMetricsMapper.toInstallationMetrics(apiMetrics[0])

        return metrics
      })
      .catch((err: unknown) => {
        const errorMessage =
          err instanceof Error && err.message
            ? err.message
            : 'Something went wrong getting the installation metrics. Try again later.'

        throw new Error(errorMessage)
      })
  }
}
