import { InstallationMetrics } from '@/dataverse-hub/domain/models/InstallationMetrics'

export class InstallationMetricsMother {
  static createInstallationMetrics(): InstallationMetrics {
    return {
      dvHubId: 'DVN_HARVARD_DATAVERSE_2008',
      name: 'Harvard Dataverse',
      country: 'USA',
      continent: 'North America',
      launchYear: 2008,
      metrics: [
        {
          dataverses: 7_500,
          datasets: {
            total: 15_000,
            deposited: 10_000,
            harvested: 5_000
          },
          files: {
            deposited: 3_250_000,
            downloaded: 15_150_000
          },
          recordDate: '2023-02-01'
        },
        {
          dataverses: 8_000,
          datasets: {
            total: 17_000,
            deposited: 11_000,
            harvested: 6_000
          },
          files: {
            deposited: 3_500_000,
            downloaded: 18_000_000
          },
          recordDate: '2025-03-01'
        }
      ],
      lastMonthMetrics: {
        recordDate: '2025-03-01',
        dataverses: 8_000,
        datasets: {
          total: 17_000,
          deposited: 11_000,
          harvested: 6_000,
          lastMonth: 2_000
        },
        files: {
          deposited: 3_500_000,
          downloaded: 18_000_000,
          depositedLastMonth: 250_000,
          downloadedLastMonth: 2_850_000
        }
      }
    }
  }

  static createInstallationMetricsWithOnlyOneMonthMetrics(): InstallationMetrics {
    return {
      dvHubId: 'DVN_HARVARD_DATAVERSE_2008',
      name: 'Harvard Dataverse',
      country: 'USA',
      continent: 'North America',
      launchYear: 2008,
      metrics: [
        {
          dataverses: 500,
          datasets: {
            total: 1_000,
            deposited: 800,
            harvested: 200
          },
          files: {
            deposited: 15_000,
            downloaded: 120_000
          },
          recordDate: '2025-03-01'
        }
      ],
      lastMonthMetrics: {
        recordDate: '2025-03-01',
        dataverses: 500,
        datasets: {
          total: 1_000,
          deposited: 800,
          harvested: 200,
          lastMonth: 1_000
        },
        files: {
          deposited: 15_000,
          downloaded: 120_000,
          depositedLastMonth: 15_000,
          downloadedLastMonth: 120_000
        }
      }
    }
  }
}
