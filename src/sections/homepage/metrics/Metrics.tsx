import { DataverseHubRepository } from '@/dataverse-hub/domain/repositories/DataverseHubRepository'
import { useGetInstallationMetrics } from './useGetInstallationMetrics'
import { MetricsResults, MetricsResultsSkeleton } from './MetricsResults'

const HARVARD_DV_HUB_ID = 'DVN_HARVARD_DATAVERSE_2008'

interface MetricsProps {
  dataverseHubRepository: DataverseHubRepository
}

export const Metrics = ({ dataverseHubRepository }: MetricsProps) => {
  const { metrics, isLoadingMetrics, errorLoadingMetrics } = useGetInstallationMetrics(
    dataverseHubRepository,
    HARVARD_DV_HUB_ID
  )

  if (isLoadingMetrics) {
    return <MetricsResultsSkeleton />
  }

  if (errorLoadingMetrics || !metrics) return null

  return <MetricsResults metrics={metrics} />
}
