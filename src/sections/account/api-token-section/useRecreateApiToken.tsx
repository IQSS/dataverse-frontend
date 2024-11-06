import { useState } from 'react'
import { recreateApiToken } from '@/users/domain/useCases/recreateApiToken'
import { TokenInfo } from '@/users/domain/models/TokenInfo'
import { UserRepository } from '@/users/domain/repositories/UserRepository'

interface UseRecreateApiTokenResult {
  recreateToken: () => Promise<void>
  isRecreating: boolean
  error: string | null
  apiTokenInfo: TokenInfo | null
}

export const useRecreateApiToken = (repository: UserRepository): UseRecreateApiTokenResult => {
  const [isRecreating, setIsRecreating] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [apiTokenInfo, setApiTokenInfo] = useState<TokenInfo | null>(null)

  const recreateToken = async () => {
    setIsRecreating(true)
    setError(null)
    try {
      const newTokenInfo = await recreateApiToken(repository)
      setApiTokenInfo(newTokenInfo)
    } catch (err) {
      const errorMessage =
        err instanceof Error && err.message
          ? err.message
          : 'Something went wrong creating the api token. Try again later.'
      setError(errorMessage)
    } finally {
      setIsRecreating(false)
    }
  }

  return { recreateToken, isRecreating, error, apiTokenInfo }
}
