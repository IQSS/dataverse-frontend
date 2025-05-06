import { useEffect, useState } from 'react'
import { DataverseInfoRepository } from '@/info/domain/repositories/DataverseInfoRepository'
import { ReadError } from '@iqss/dataverse-client-javascript'
import { JSDataverseReadErrorHandler } from '../helpers/JSDataverseReadErrorHandler'

interface UseGetTermsOfUseReturnType {
  termsOfUse: string
  error: string | null
  isLoading: boolean
}

export const useGetTermsOfUse = (
  dataverseInfoRepository: DataverseInfoRepository
): UseGetTermsOfUseReturnType => {
  const [termsOfUse, setTermsOfUse] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleGetUseOfTerms = async () => {
      setIsLoading(true)
      try {
        const termsOfUse = await dataverseInfoRepository.getTermsOfUse()

        setTermsOfUse(termsOfUse)
      } catch (err) {
        if (err instanceof ReadError) {
          const error = new JSDataverseReadErrorHandler(err)
          const formattedError =
            error.getReasonWithoutStatusCode() ?? /* istanbul ignore next */ error.getErrorMessage()

          setError(formattedError)
        } else {
          setError('Something went wrong getting the use of terms. Try again later.')
        }
      } finally {
        setIsLoading(false)
      }
    }

    void handleGetUseOfTerms()
  }, [dataverseInfoRepository])

  return {
    termsOfUse,
    error,
    isLoading
  }
}
