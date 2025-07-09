import { getUserSelectableRoles } from '@iqss/dataverse-client-javascript'
import { Role } from '../../domain/models/Role'
import { RoleRepository } from '../../domain/repositories/RoleRepository'

export class RoleJSDataverseRepository implements RoleRepository {
  getUserSelectableRoles(): Promise<Role[]> {
    return getUserSelectableRoles.execute()
  }
}
