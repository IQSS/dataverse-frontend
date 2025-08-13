import { FakerHelper } from '@tests/component/shared/FakerHelper'
import { RoleRepository } from '@/roles/domain/repositories/RoleRepository'
import { Role } from '@/roles/domain/models/Role'

export class RoleMockRepository implements RoleRepository {
  getUserSelectableRoles(): Promise<Role[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            alias: 'admin',
            name: 'Admin',
            description: 'Administrator role with full permissions',
            permissions: ['manage_users', 'manage_collections', 'view_reports']
          },
          {
            id: 2,
            alias: 'user',
            name: 'User',
            description: 'Standard user role with limited permissions',
            permissions: ['view_collections', 'edit_own_items', 'comment']
          },
          {
            id: 3,
            alias: 'guest',
            name: 'Guest',
            description: 'Guest role with minimal permissions',
            permissions: ['view_public_collections']
          }
        ])
      }, FakerHelper.loadingTimout())
    })
  }
}
