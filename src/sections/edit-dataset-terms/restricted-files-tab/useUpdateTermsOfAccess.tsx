import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DatasetRepository } from '../../../dataset/domain/repositories/DatasetRepository'
import { JSDataverseWriteErrorHandler } from '../../../shared/helpers/JSDataverseWriteErrorHandler'
import { WriteError } from '@iqss/dataverse-client-javascript'
import { TermsOfAccess } from '@/dataset/domain/models/Dataset'
import { updateTermsOfAccess } from '@/dataset/domain/useCases/updateTermsOfAccess'

export interface UseUpdateTermsOfAccess {
  datasetRepository: DatasetRepository
  onSuccessfulUpdateTermsOfAccess: () => void
}

interface UseUpdateTermsOfAccessReturn {
  isLoading: boolean
  error: string | null
  handleUpdateTermsOfAccess: (
    datasetId: number | string,
    termsOfAccess: TermsOfAccess
  ) => Promise<void>
}

export const useUpdateTermsOfAccess = ({
  datasetRepository,
  onSuccessfulUpdateTermsOfAccess
}: UseUpdateTermsOfAccess): UseUpdateTermsOfAccessReturn => {
  const { t } = useTranslation('dataset')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpdateTermsOfAccess = async (
    datasetId: number | string,
    termsOfAccess: TermsOfAccess
  ) => {
    setIsLoading(true)
    setError(null)
    console.log('termsOfAccess', termsOfAccess)
    try {
      const response = await updateTermsOfAccess(datasetRepository, datasetId, termsOfAccess)
      console.log('response', response)

      onSuccessfulUpdateTermsOfAccess()
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
    handleUpdateTermsOfAccess,
    isLoading,
    error
  }
}
