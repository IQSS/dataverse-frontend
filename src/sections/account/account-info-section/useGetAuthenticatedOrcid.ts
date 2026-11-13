import { useEffect, useState } from 'react'
import { UserRepository } from '@/users/domain/repositories/UserRepository'
import { getAuthenticatedOrcid } from '@/users/domain/useCases/getAuthenticatedOrcid'

interface UseGetAuthenticatedOrcidReturnType {
  orcid: string | null
  isLoading: boolean
  error: boolean
}

export const useGetAuthenticatedOrcid = (
  userRepository: UserRepository
): UseGetAuthenticatedOrcidReturnType => {
  const [orcid, setOrcid] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let isCurrent = true
    setIsLoading(true)
    getAuthenticatedOrcid(userRepository)
      .then((authenticatedOrcid) => {
        if (isCurrent) {
          setOrcid(authenticatedOrcid)
          setError(false)
        }
      })
      .catch(() => {
        if (isCurrent) {
          setError(true)
        }
      })
      .finally(() => {
        if (isCurrent) {
          setIsLoading(false)
        }
      })
    return () => {
      isCurrent = false
    }
  }, [userRepository])

  return { orcid, isLoading, error }
}
