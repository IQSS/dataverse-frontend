import { useEffect, useState } from 'react'
import { DataverseInfoRepository } from '@/info/domain/repositories/DataverseInfoRepository'

interface UseGetTermsOfUseReturnType {
  termsOfUse: string | null
  error: string | null
  isLoading: boolean
}

export const useGetTermsOfUse = (
  dataverseInfoRepository: DataverseInfoRepository
): UseGetTermsOfUseReturnType => {
  const [termsOfUse, setTermsOfUse] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleGetUseOfTerms = async () => {
      setIsLoading(true)
      try {
        const termsOfUse = await dataverseInfoRepository.getTermsOfUse()

        setTermsOfUse(termsOfUse)
      } catch (err) {
        const errorMessage =
          err instanceof Error && err.message
            ? err.message
            : 'Something went wrong getting the use of terms. Try again later.'
        setError(errorMessage)
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
