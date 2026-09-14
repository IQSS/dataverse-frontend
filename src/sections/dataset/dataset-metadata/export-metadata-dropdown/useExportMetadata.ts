import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { DatasetNotNumberedVersion } from '@iqss/dataverse-client-javascript'
import { DatasetPublishingStatus, DatasetVersion } from '@/dataset/domain/models/Dataset'
import { exportDatasetMetadata } from '@/dataset/domain/useCases/exportDatasetMetadata'
import { useDatasetRepositories } from '@/shared/contexts/repositories/RepositoriesProvider'

interface UseExportMetadataParams {
  datasetPersistentId: string
  datasetVersion: DatasetVersion
}

interface UseExportMetadataReturn {
  handleExportMetadata: (exporter: string) => Promise<void>
}

export const useExportMetadata = ({
  datasetPersistentId,
  datasetVersion
}: UseExportMetadataParams): UseExportMetadataReturn => {
  const { datasetRepository } = useDatasetRepositories()
  const { t } = useTranslation('shared')

  const handleExportMetadata = useCallback(
    async (exporter: string) => {
      const newWindow = window.open('', '_blank')

      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        return
      }

      try {
        newWindow.document.title = t('exportMetadata')

        const version =
          datasetVersion.publishingStatus === DatasetPublishingStatus.DRAFT
            ? DatasetNotNumberedVersion.DRAFT
            : undefined
        const metadata = await exportDatasetMetadata(
          datasetRepository,
          datasetPersistentId,
          exporter,
          version
        )

        const blob = new Blob([metadata.content], { type: metadata.contentType })
        const url = URL.createObjectURL(blob)
        newWindow.location.href = url

        setTimeout(() => URL.revokeObjectURL(url), 1000)
      } catch {
        if (!newWindow.closed) newWindow.close()
        toast.error(t('exportMetadataError'))
      }
    },
    [datasetRepository, datasetPersistentId, datasetVersion.publishingStatus, t]
  )

  return { handleExportMetadata }
}
