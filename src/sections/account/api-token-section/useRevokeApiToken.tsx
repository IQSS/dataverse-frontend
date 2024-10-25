import { useState, useCallback } from 'react'
import { revokeApiToken } from '@/users/domain/useCases/revokeApiToken'
import { ApiTokenInfoRepository } from '@/users/domain/repositories/ApiTokenInfoRepository'

interface UseRevokeApiTokenResult {
  revokeToken: () => Promise<void>
  isRevoking: boolean
  error: string | null
}

export const useRevokeApiToken = (repository: ApiTokenInfoRepository): UseRevokeApiTokenResult => {
  const [isRevoking, setIsRevoking] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const revokeToken = useCallback(async () => {
    setIsRevoking(true)
    setError(null)

    try {
      await revokeApiToken(repository)
    } catch (err) {
      console.error('There was an error revoking Api token:', err)
      setError('Failed to revoke API token.')
    } finally {
      setIsRevoking(false)
    }
  }, [repository])

  return { revokeToken, isRevoking, error }
}
