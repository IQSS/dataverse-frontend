import { RoleFilters } from '@/sections/account/my-data-section/my-data-filter-panel/role-filters/RoleFilters'
import { Role } from '@/users/domain/models/Role'

describe('RoleFilters', () => {
  const userRoles: Role[] = [
    { roleId: 1, roleName: 'Admin' },
    { roleId: 2, roleName: 'Contributor' },
    { roleId: 3, roleName: 'Curator' }
  ]

  const currentRoleIds = [1, 2, 3]

  it('should render all roles with correct labels', () => {
    cy.customMount(
      <RoleFilters
        userRoles={userRoles}
        currentRoleIds={currentRoleIds}
        onRolesChange={cy.stub()}
        isLoadingCollectionItems={false}
      />
    )

    userRoles.forEach((role) => {
      cy.findByLabelText(role.roleName).should('exist')
    })
  })

  it('should call onRolesChange when a role is selected or deselected', () => {
    const onRolesChange = cy.stub().as('onRolesChange')

    cy.customMount(
      <RoleFilters
        userRoles={userRoles}
        currentRoleIds={currentRoleIds}
        onRolesChange={onRolesChange}
        isLoadingCollectionItems={false}
      />
    )

    cy.findByLabelText('Contributor').click()
    cy.wrap(onRolesChange).should('be.calledWith', { roleId: 2, checked: false })

    cy.findByLabelText('Admin').click()
    cy.wrap(onRolesChange).should('be.calledWith', { roleId: 1, checked: false })
  })

  it('should disable checkboxes when loading or only one role is selected', () => {
    cy.customMount(
      <RoleFilters
        userRoles={userRoles}
        currentRoleIds={currentRoleIds}
        onRolesChange={cy.stub()}
        isLoadingCollectionItems={true}
      />
    )

    userRoles.forEach((role) => {
      cy.findByLabelText(role.roleName).should('be.disabled')
    })

    cy.customMount(
      <RoleFilters
        userRoles={userRoles}
        currentRoleIds={[1]}
        onRolesChange={cy.stub()}
        isLoadingCollectionItems={false}
      />
    )

    cy.findByLabelText('Admin').should('be.disabled')
    cy.findByLabelText('Contributor').should('not.be.disabled')
  })
})
