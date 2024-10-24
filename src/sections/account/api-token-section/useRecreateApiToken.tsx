import { useState, useEffect } from 'react'
import { recreateApiToken } from '@/users/domain/useCases/recreateApiToken'
import { TokenInfo } from '@/users/domain/models/TokenInfo'
import { ApiTokenInfoRepository } from '@/users/domain/repositories/ApiTokenInfoRepository'

interface UseRecreateApiTokenResult {
  initiateRecreateToken: () => void
  isRecreating: boolean
  error: string | null
  tokenInfo: TokenInfo | null
}

export const useRecreateApiToken = (
  repository: ApiTokenInfoRepository
): UseRecreateApiTokenResult => {
  const [isRecreating, setIsRecreating] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null)
  const [shouldRecreate, setShouldRecreate] = useState<boolean>(false)

  const initiateRecreateToken = () => {
    setShouldRecreate(true)
  }
  useEffect(() => {
    const recreateToken = async () => {
      setIsRecreating(true)
      setError(null)

      try {
        const newTokenInfo = await recreateApiToken(repository)
        setTokenInfo(newTokenInfo)
      } catch (err) {
        console.error('Error recreating token:', err)
        setError('Failed to recreate API token.')
      } finally {
        setIsRecreating(false)
        setShouldRecreate(false)
      }
    }
    if (shouldRecreate) {
      void recreateToken()
    }
  }, [shouldRecreate, repository])

  return { initiateRecreateToken, isRecreating, error, tokenInfo }
}
