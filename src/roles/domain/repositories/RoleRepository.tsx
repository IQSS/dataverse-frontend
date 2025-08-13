import { Role } from '../models/Role'

export interface RoleRepository {
  getUserSelectableRoles: () => Promise<Role[]>
}
