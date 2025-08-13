import { useState } from 'react'
import { revokeApiToken } from '@/users/domain/useCases/revokeApiToken'
import { UserRepository } from '@/users/domain/repositories/UserRepository'

interface UseRevokeApiTokenResult {
  revokeToken: () => Promise<void>
  isRevoking: boolean
  error: string | null
}

export const useRevokeApiToken = (repository: UserRepository): UseRevokeApiTokenResult => {
  const [isRevoking, setIsRevoking] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const revokeToken = async () => {
    setIsRevoking(true)
    setError(null)
    try {
      await revokeApiToken(repository)
    } catch (err) {
      const errorMessage =
        err instanceof Error && err.message
          ? err.message
          : 'Something went wrong revoking the api token. Try again later.'
      setError(errorMessage)
    } finally {
      setIsRevoking(false)
    }
  }

  return { revokeToken, isRevoking, error }
}
