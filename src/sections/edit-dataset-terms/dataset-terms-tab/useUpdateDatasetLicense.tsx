import { DatasetRepository } from '../../../dataset/domain/repositories/DatasetRepository'
import { DatasetLicenseUpdateRequest } from '../../../dataset/domain/models/DatasetLicenseUpdateRequest'
import { JSDataverseWriteErrorHandler } from '../../../shared/helpers/JSDataverseWriteErrorHandler'
import { WriteError } from '@iqss/dataverse-client-javascript'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export interface UseUpdateDatasetLicense {
  datasetRepository: DatasetRepository
  onSuccessfulUpdateLicense: () => void
}

interface UseUpdateDatasetLicenseReturn {
  isLoading: boolean
  error: string | null
  handleUpdateLicense: (
    datasetId: number | string,
    licenseUpdateRequest: DatasetLicenseUpdateRequest
  ) => Promise<void>
}

export const useUpdateDatasetLicense = ({
  datasetRepository,
  onSuccessfulUpdateLicense
}: UseUpdateDatasetLicense): UseUpdateDatasetLicenseReturn => {
  const { t } = useTranslation('dataset')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpdateLicense = async (
    datasetId: number | string,
    licenseUpdateRequest: DatasetLicenseUpdateRequest
  ) => {
    setIsLoading(true)
    setError(null)

    try {
      await datasetRepository.updateLicense(datasetId, licenseUpdateRequest)
      onSuccessfulUpdateLicense()
    } catch (err: WriteError | unknown) {
      if (err instanceof WriteError) {
        const errorHandler = new JSDataverseWriteErrorHandler(err)
        const formattedError =
          errorHandler.getReasonWithoutStatusCode() ?? errorHandler.getErrorMessage()
        setError(formattedError)
      } else {
        setError(t('editTerms.defaultLicenseUpdateError'))
      }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    handleUpdateLicense,
    isLoading,
    error
  }
}
