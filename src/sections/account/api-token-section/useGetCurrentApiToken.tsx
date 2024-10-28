import { useState, useEffect, useCallback } from 'react'
import { TokenInfo } from '@/users/domain/models/TokenInfo'
import { ApiTokenInfoRepository } from '@/users/domain/repositories/ApiTokenInfoRepository'
import { getCurrentApiToken } from '@/users/domain/useCases/getCurrentApiToken'

interface UseGetApiTokenResult {
  apiTokenInfo: TokenInfo
  isLoading: boolean
  error: string | null
}

export const useGetApiToken = (repository: ApiTokenInfoRepository): UseGetApiTokenResult => {
  const [apiTokenInfo, setApiTokenInfo] = useState<TokenInfo>({
    apiToken: '',
    expirationDate: ''
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
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch API token.'
      console.error(errorMessage)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [repository])

  useEffect(() => {
    void fetchTokenInfo()
  }, [fetchTokenInfo])

  return { error, apiTokenInfo, isLoading }
}
