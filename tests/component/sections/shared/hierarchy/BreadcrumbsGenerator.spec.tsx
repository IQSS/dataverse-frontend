import { BreadcrumbsGenerator } from '../../../../../src/sections/shared/hierarchy/BreadcrumbsGenerator'
import { UpwardHierarchyNodeMother } from '../../../shared/hierarchy/domain/models/UpwardHierarchyNodeMother'

describe('BreadcrumbsGenerator', () => {
  it('shows the hierarchy items as breadcrumbs', () => {
    const grandparent = UpwardHierarchyNodeMother.create({ name: 'Grandparent' })
    const parent = UpwardHierarchyNodeMother.create({ name: 'Parent', parent: grandparent })
    const root = UpwardHierarchyNodeMother.create({ name: 'Root', parent: parent })

    cy.customMount(<BreadcrumbsGenerator hierarchy={root} />)
    cy.findByText('Root').should('have.class', 'active')
    cy.findByRole('button', { name: 'Parent' }).should('exist')
    cy.findByRole('button', { name: 'Grandparent' }).should('exist')
  })
})
