import { RoleFilters } from '@/sections/account/my-data-section/my-data-filter-panel/role-filters/RoleFilters'
import { Role } from '@/roles/domain/models/Role'

describe('RoleFilters', () => {
  const userRoles: Role[] = [
    {
      id: 1,
      name: 'Admin',
      alias: 'admin',
      description: 'Administrator role with all permissions',
      permissions: []
    },
    {
      id: 2,
      name: 'Contributor',
      alias: 'contributor',
      description: 'Can contribute to datasets',
      permissions: []
    },
    {
      id: 3,
      name: 'Curator',
      alias: 'curator',
      description: 'Can curate datasets',
      permissions: []
    }
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
      cy.findByLabelText(role.name).should('exist')
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
      cy.findByLabelText(role.name).should('be.disabled')
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
