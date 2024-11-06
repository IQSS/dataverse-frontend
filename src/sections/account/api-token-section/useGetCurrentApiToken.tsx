import { useState, useEffect, useCallback } from 'react'
import { TokenInfo } from '@/users/domain/models/TokenInfo'
import { UserRepository } from '@/users/domain/repositories/UserRepository'
import { getCurrentApiToken } from '@/users/domain/useCases/getCurrentApiToken'

interface UseGetApiTokenResult {
  apiTokenInfo: TokenInfo
  isLoading: boolean
  error: string | null
}

export const useGetApiToken = (repository: UserRepository): UseGetApiTokenResult => {
  const [apiTokenInfo, setApiTokenInfo] = useState<TokenInfo>({
    apiToken: '',
    expirationDate: new Date(0)
  })
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTokenInfo = useCallback(async () => {
    try {
      setIsLoading(true)
      const tokenInfo = await getCurrentApiToken(repository)
      setApiTokenInfo({
        apiToken: tokenInfo.apiToken,
        expirationDate: tokenInfo.expirationDate
      })
      setError(null)
    } catch (err) {
      const errorMessage =
        err instanceof Error && err.message
          ? err.message
          : 'Something went wrong getting the current api token. Try again later.'
      setError(
        errorMessage ===
          'There was an error when reading the resource. Reason was: [404] Token not found.'
          ? null
          : errorMessage
      )
    } finally {
      setIsLoading(false)
    }
  }, [repository])

  useEffect(() => {
    void fetchTokenInfo()
  }, [fetchTokenInfo])
  return { isLoading, error, apiTokenInfo }
}
