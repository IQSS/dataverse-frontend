import { useEffect, useState } from 'react'
import { DataverseHubRepository } from '@/dataverse-hub/domain/repositories/DataverseHubRepository'
import { InstallationMetrics } from '@/dataverse-hub/domain/models/InstallationMetrics'
import { getInstallationMetrics } from '@/dataverse-hub/domain/useCases/getInstallationMetrics'

export const useGetInstallationMetrics = (
  dataverseHubRepository: DataverseHubRepository,
  dvHubId: string
) => {
  const [metrics, setMetrics] = useState<InstallationMetrics | null>(null)
  const [isLoadingMetrics, setIsLoadingMetrics] = useState<boolean>(true)
  const [errorLoadingMetrics, setErrorLoadingMetrics] = useState<string | null>(null)

  useEffect(() => {
    const handleGetMetrics = async () => {
      setIsLoadingMetrics(true)

      try {
        const metrics = await getInstallationMetrics(dataverseHubRepository, dvHubId)

        setMetrics(metrics)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error fetching metrics'
        setErrorLoadingMetrics(errorMessage)
      } finally {
        setIsLoadingMetrics(false)
      }
    }

    void handleGetMetrics()
  }, [dataverseHubRepository, dvHubId])

  return { metrics, isLoadingMetrics, errorLoadingMetrics }
}
