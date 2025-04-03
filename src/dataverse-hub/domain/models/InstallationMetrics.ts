export interface InstallationMetrics {
  dvHubId: string
  name: string
  country: string
  continent: string
  launchYear: number
  metrics: Metric[]
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
