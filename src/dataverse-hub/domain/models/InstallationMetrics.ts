export interface InstallationMetrics {
  dvHubId: string
  name: string
  country: string
  continent: string
  launchYear: number
  metrics: Metric[]
  lastMonthMetrics: MetricWithLastMonth
}

export interface Metric {
  dataverses: number
  datasets: {
    total: number
    deposited: number
    harvested: number
  }
  files: {
    deposited: number
    downloaded: number
  }
  recordDate: string
}

export type MetricWithLastMonth = Metric & {
  datasets: {
    lastMonth: number
  }
  files: {
    depositedLastMonth: number
    downloadedLastMonth: number
  }
}
