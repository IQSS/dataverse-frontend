import { useState, useEffect } from 'react'
import { RoleRepository } from '@/roles/domain/repositories/RoleRepository'
import { Role } from '@/roles/domain/models/Role'

export const useSelectableRoles = (roleRepository: RoleRepository) => {
  const [roles, setRoles] = useState<Role[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const fetchedRoles = await roleRepository.getUserSelectableRoles()
        setRoles(fetchedRoles)
        console.log('Fetched roles:', fetchedRoles)
      } catch (err) {
        setError(err as Error)
      } finally {
        setIsLoading(false)
      }
    }

    void fetchRoles()
  }, [roleRepository])

  return { roles, isLoading, error }
}
