import { InstallationMetrics } from '@/dataverse-hub/domain/models/InstallationMetrics'
import { ApiInstallationMetrics } from '../models/ApiInstallationMetrics'
import { DateHelper } from '@/shared/helpers/DateHelper'

export class ApiDataverseMetricsMapper {
  static toInstallationMetrics(apiDataverseMetrics: ApiInstallationMetrics): InstallationMetrics {
    return {
      dvHubId: apiDataverseMetrics.dvHubId,
      name: apiDataverseMetrics.name,
      country: apiDataverseMetrics.country,
      continent: apiDataverseMetrics.continent,
      launchYear: apiDataverseMetrics.launchYear,
      metrics: apiDataverseMetrics.metrics.map((metric) => ({
        dataverses: metric.dataverses,
        datasets: {
          total: metric.localDatasets + metric.harvestedDatasets,
          deposited: metric.localDatasets,
          harvested: metric.harvestedDatasets
        },
        files: {
          deposited: metric.files,
          downloaded: metric.downloads
        },
        recordDate: DateHelper.toDisplayFormatYYYYMMDD(new Date(metric.recordDate))
      }))
    }
  }
}
