import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { WriteError } from '@iqss/dataverse-client-javascript'
import { JSDataverseWriteErrorHandler } from '@/shared/helpers/JSDataverseWriteErrorHandler'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { deleteDataset } from '@/dataset/domain/useCases/deleteDataset'
import { Utils } from '@/shared/helpers/Utils'

interface UseDeleteDataset {
  datasetRepository: DatasetRepository
  onSuccessfulDelete: () => void
}

interface UseDeleteDatasetReturn {
  isDeletingDataset: boolean
  errorDeletingDataset: string | null
  handleDeleteDataset: (datasetId: number | string) => Promise<void>
}

export const useDeleteDataset = ({
  datasetRepository,
  onSuccessfulDelete
}: UseDeleteDataset): UseDeleteDatasetReturn => {
  const { t } = useTranslation('dataset')
  const [isDeletingDataset, setIsDeletingDataset] = useState<boolean>(false)
  const [errorDeletingDataset, setErrorDeletingDataset] = useState<string | null>(null)

  const handleDeleteDataset = async (datasetId: number | string) => {
    setIsDeletingDataset(true)

    try {
      await deleteDataset(datasetRepository, datasetId)

      // Wait before calling onSuccessfulDelete (which is redirecting to parent collection)
      // Otherwise Search API will still return the deleted dataset item
      await Utils.sleep(3000)

      onSuccessfulDelete()
    } catch (err: WriteError | unknown) {
      if (err instanceof WriteError) {
        const error = new JSDataverseWriteErrorHandler(err)
        const formattedError =
          error.getReasonWithoutStatusCode() ?? /* istanbul ignore next */ error.getErrorMessage()
        setErrorDeletingDataset(formattedError)
      } else {
        setErrorDeletingDataset(
          t('datasetActionButtons.editDataset.deleteDatasetModal.defaultDatasetDeleteError')
        )
      }
    } finally {
      setIsDeletingDataset(false)
    }
  }

  return {
    isDeletingDataset,
    errorDeletingDataset,
    handleDeleteDataset
  }
}
