import { BreadcrumbsGenerator } from '../../../../../src/sections/shared/hierarchy/BreadcrumbsGenerator'
import { UpwardHierarchyNodeMother } from '../../../shared/hierarchy/domain/models/UpwardHierarchyNodeMother'

describe('BreadcrumbsGenerator', () => {
  it('shows the hierarchy items as breadcrumbs', () => {
    const root = UpwardHierarchyNodeMother.createCollection({
      name: 'Root',
      id: 'root'
    })
    const collection = UpwardHierarchyNodeMother.createCollection({
      name: 'Collection',
      id: 'collection1',
      parent: root
    })
    const dataset = UpwardHierarchyNodeMother.createDataset({
      name: 'Dataset',
      parent: collection,
      version: '1.0',
      persistentId: 'doi:10.5072/FK2/ABC123'
    })
    const file = UpwardHierarchyNodeMother.createFile({ name: 'File', parent: dataset })

    cy.customMount(<BreadcrumbsGenerator hierarchy={file} />)
    cy.findByText('File').should('have.class', 'active')
    cy.findByRole('link', { name: 'Dataset' })
      .should('exist')
      .should('have.attr', 'href', '/datasets?persistentId=doi:10.5072/FK2/ABC123&version=1.0')
    cy.findByRole('link', { name: 'Collection' })
      .should('exist')
      .should('have.attr', 'href', '/collections?id=collection1')
    cy.findByRole('link', { name: 'Root' }).should('have.attr', 'href', '/')
  })

  it('shows the breadcrumb active when the hierarchy has only one item', () => {
    const root = UpwardHierarchyNodeMother.createCollection({
      name: 'Root',
      id: 'root'
    })

    cy.customMount(<BreadcrumbsGenerator hierarchy={root} />)
    cy.findByText('Root').should('have.class', 'active')
  })

  it('shows the action item active when withActionItem is true', () => {
    const root = UpwardHierarchyNodeMother.createCollection({
      name: 'Root',
      id: 'root'
    })
    const dataset = UpwardHierarchyNodeMother.createDataset({
      name: 'Dataset',
      parent: root,
      version: '1.0',
      persistentId: 'doi:10.5072/FK2/ABC123'
    })

    cy.customMount(
      <BreadcrumbsGenerator hierarchy={dataset} withActionItem actionItemText="Action Item Text" />
    )
    cy.findByText('Action Item Text').should('exist').should('have.class', 'active')
    cy.findByText('Dataset').should('exist').should('not.have.class', 'active')
  })
})
