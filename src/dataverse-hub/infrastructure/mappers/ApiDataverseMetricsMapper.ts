import {
  InstallationMetrics,
  Metric,
  MetricWithLastMonth
} from '@/dataverse-hub/domain/models/InstallationMetrics'
import { ApiInstallationMetrics } from '../models/ApiInstallationMetrics'
import { DateHelper } from '@/shared/helpers/DateHelper'

export class ApiDataverseMetricsMapper {
  static toInstallationMetrics(apiDataverseMetrics: ApiInstallationMetrics): InstallationMetrics {
    const installationMetrics: Omit<InstallationMetrics, 'lastMonthMetrics'> = {
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

    const installationMetricsWithLastMonthMetrics: InstallationMetrics = {
      ...installationMetrics,
      lastMonthMetrics: this.toLastMonthMetrics(installationMetrics.metrics)
    }

    return installationMetricsWithLastMonthMetrics
  }

  // This is comparing last two months of metrics to get the last month results
  private static toLastMonthMetrics(metrics: Metric[]): MetricWithLastMonth {
    const lastMonthMetrics: Metric = metrics[metrics.length - 1]
    const previousMonthMetrics: Metric | undefined =
      metrics.length >= 2 ? metrics[metrics.length - 2] : undefined

    return {
      recordDate: lastMonthMetrics.recordDate,
      dataverses: lastMonthMetrics.dataverses,
      datasets: {
        total: lastMonthMetrics.datasets.total,
        deposited: lastMonthMetrics.datasets.deposited,
        harvested: lastMonthMetrics.datasets.harvested,
        lastMonth: previousMonthMetrics
          ? lastMonthMetrics.datasets.total - previousMonthMetrics.datasets.total
          : lastMonthMetrics.datasets.total
      },
      files: {
        deposited: lastMonthMetrics.files.deposited,
        depositedLastMonth: previousMonthMetrics
          ? lastMonthMetrics.files.deposited - previousMonthMetrics.files.deposited
          : lastMonthMetrics.files.deposited,
        downloaded: lastMonthMetrics.files.downloaded,
        downloadedLastMonth: previousMonthMetrics
          ? lastMonthMetrics.files.downloaded - previousMonthMetrics.files.downloaded
          : lastMonthMetrics.files.downloaded
      }
    }
  }
}
