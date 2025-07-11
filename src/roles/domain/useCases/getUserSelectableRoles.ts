import { Role } from '../models/Role'
import { RoleRepository } from '../repositories/RoleRepository'

export function getUserSelectableRoles(roleRepository: RoleRepository): Promise<Role[]> {
  return roleRepository.getUserSelectableRoles()
}
