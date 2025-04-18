import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { WriteError } from '@iqss/dataverse-client-javascript'
import { JSDataverseWriteErrorHandler } from '@/shared/helpers/JSDataverseWriteErrorHandler'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { deleteDatasetDraft } from '@/dataset/domain/useCases/deleteDatasetDraft'
import { Utils } from '@/shared/helpers/Utils'

interface UseDeleteDraftDataset {
  datasetRepository: DatasetRepository
  onSuccessfulDelete: () => void
}

interface UseDeleteDraftDatasetReturn {
  isDeletingDataset: boolean
  errorDeletingDataset: string | null
  handleDeleteDraftDataset: (datasetId: number | string) => Promise<void>
}

export const useDeleteDraftDataset = ({
  datasetRepository,
  onSuccessfulDelete
}: UseDeleteDraftDataset): UseDeleteDraftDatasetReturn => {
  const { t } = useTranslation('dataset')
  const [isDeletingDataset, setIsDeletingDataset] = useState<boolean>(false)
  const [errorDeletingDataset, setErrorDeletingDataset] = useState<string | null>(null)

  const handleDeleteDraftDataset = async (datasetId: number | string) => {
    setIsDeletingDataset(true)

    try {
      await deleteDatasetDraft(datasetRepository, datasetId)

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
    handleDeleteDraftDataset
  }
}
