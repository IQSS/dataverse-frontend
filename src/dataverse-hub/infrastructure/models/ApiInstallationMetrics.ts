export interface ApiInstallationMetrics {
  dvHubId: string
  name: string
  country: string
  continent: string
  launchYear: number
  metrics: ApiMetric[]
}

export interface ApiMetric {
  recordDate: string
  files: number
  downloads: number
  datasets: number
  harvestedDatasets: number
  localDatasets: number
  dataverses: number
}
