import { useState, useEffect } from 'react'
import { RoleRepository } from '@/roles/domain/repositories/RoleRepository'
import { Role } from '@/roles/domain/models/Role'

export const useSelectableRoles = (roleRepository: RoleRepository) => {
  const [roles, setRoles] = useState<Role[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const fetchedRoles = await roleRepository.getUserSelectableRoles()
        setRoles(fetchedRoles)
      } catch (err) {
        const errorMessage =
          err instanceof Error && err.message
            ? err.message
            : 'Something went wrong getting selectable roles for filtering. Try again later.'
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    void fetchRoles()
  }, [roleRepository])

  return { roles, isLoading, error }
}
