import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { WriteError } from '@iqss/dataverse-client-javascript'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { setDatasetCurationStatus } from '@/dataset/domain/useCases/setDatasetCurationStatus'
import { deleteDatasetCurationStatus } from '@/dataset/domain/useCases/deleteDatasetCurationStatus'
import { JSDataverseWriteErrorHandler } from '@/shared/helpers/JSDataverseWriteErrorHandler'

interface UseChangeCurationStatusProps {
  datasetRepository: DatasetRepository
  datasetId: string | number
  onSuccess: () => void
}

interface UseChangeCurationStatusReturn {
  isChangingStatus: boolean
  changeCurationStatus: (label: string) => Promise<void>
  removeCurationStatus: () => Promise<void>
}

export const useChangeCurationStatus = ({
  datasetRepository,
  datasetId,
  onSuccess
}: UseChangeCurationStatusProps): UseChangeCurationStatusReturn => {
  const { t } = useTranslation('dataset')
  const [isChangingStatus, setIsChangingStatus] = useState<boolean>(false)

  const runStatusChange = async (action: () => Promise<void>, successMessage: string) => {
    setIsChangingStatus(true)

    try {
      await action()
      toast.success(successMessage)
      onSuccess()
    } catch (err: WriteError | unknown) {
      const reason =
        err instanceof WriteError
          ? new JSDataverseWriteErrorHandler(err).getReasonWithoutStatusCode()
          : null
      toast.error(reason ?? t('curationStatus.changeError'))
    } finally {
      setIsChangingStatus(false)
    }
  }

  const changeCurationStatus = (label: string) =>
    runStatusChange(
      () => setDatasetCurationStatus(datasetRepository, datasetId, label),
      t('curationStatus.changed', { label })
    )

  const removeCurationStatus = () =>
    runStatusChange(
      () => deleteDatasetCurationStatus(datasetRepository, datasetId),
      t('curationStatus.removed')
    )

  return { isChangingStatus, changeCurationStatus, removeCurationStatus }
}
