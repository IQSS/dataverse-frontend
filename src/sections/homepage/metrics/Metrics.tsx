import { DataverseHubRepository } from '@/dataverse-hub/domain/repositories/DataverseHubRepository'
import { useMediaQuery } from '@/shared/hooks/useMediaQuery'
import { useGetInstallationMetrics } from './useGetInstallationMetrics'
import { MetricsResults, MetricsResultsSkeleton } from './MetricsResults'

// TODO:ME - Change 30 days to last month

const HARVARD_DV_HUB_ID = 'DVN_HARVARD_DATAVERSE_2008'

interface MetricsProps {
  dataverseHubRepository: DataverseHubRepository
}

export const Metrics = ({ dataverseHubRepository }: MetricsProps) => {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  const { metrics, isLoadingMetrics, errorLoadingMetrics } = useGetInstallationMetrics(
    dataverseHubRepository,
    HARVARD_DV_HUB_ID
  )

  if (isLoadingMetrics) {
    return <MetricsResultsSkeleton />
  }

  if (errorLoadingMetrics || !metrics) return null

  return <MetricsResults metrics={metrics} prefersReducedMotion={prefersReducedMotion} />
}
