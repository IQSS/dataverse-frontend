import { useEffect, useState } from 'react'
import { axiosInstance } from '@/axiosInstance'

interface UseGetTermsOfUseReturnType {
  termsOfUse: string | null
  error: string | null
  isLoading: boolean
}

export const useGetTermsOfUse = (): UseGetTermsOfUseReturnType => {
  const [termsOfUse, setTermsOfUse] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleGetUseOfTerms = async () => {
      setIsLoading(true)
      try {
        const response = await axiosInstance.get<{ data: { message: string } }>(
          '/api/v1/info/apiTermsOfUse',
          { excludeToken: true }
        )

        setTermsOfUse(response.data.data.message)
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
  }, [])

  return {
    termsOfUse,
    error,
    isLoading
  }
}
