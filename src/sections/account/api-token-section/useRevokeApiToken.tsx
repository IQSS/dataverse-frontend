import { useState, useEffect, useCallback } from 'react'
import { TokenInfo } from '@/users/domain/models/TokenInfo'
import { ApiTokenInfoRepository } from '@/users/domain/repositories/ApiTokenInfoRepository'
import { revokeApiToken } from '@/users/domain/useCases/revokeApiToken'

interface useRevokeApiTokenResult {
  apiTokenInfo: TokenInfo
  isLoading: boolean
  error: string | null
}

export const useRevokeApiToken = async (
  repository: ApiTokenInfoRepository
): Promise<useRevokeApiTokenResult> => {
  const [apiTokenInfo, setApiTokenInfo] = useState<TokenInfo>({
    apiToken: '',
    expirationDate: ''
  })
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  try {
    setIsLoading(true)
    await revokeApiToken(repository)
    setApiTokenInfo({
      apiToken: '',
      expirationDate: ''
    })
    setError(null)
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to fetch API token.'
    console.error(errorMessage)
    setError(errorMessage)
  } finally {
    setIsLoading(false)
  }

  return { error, apiTokenInfo, isLoading }
}
