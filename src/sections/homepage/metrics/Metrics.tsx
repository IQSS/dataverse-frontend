import { DataverseHubRepository } from '@/dataverse-hub/domain/repositories/DataverseHubRepository'
import { useGetInstallationMetrics } from './useGetInstallationMetrics'
import { MetricsResults, MetricsResultsSkeleton } from './MetricsResults'

const HARVARD_DV_HUB_ID = '57B6E0DD-B371-4AFE-A0C0-FB22621DDD73'

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
