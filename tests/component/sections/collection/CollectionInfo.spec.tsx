import { CollectionInfo } from '../../../../src/sections/collection/CollectionInfo'
import { CollectionMother } from '../../collection/domain/models/CollectionMother'

describe('CollectionInfo', () => {
  it('renders collection title', () => {
    const collection = CollectionMother.create({
      name: 'Collection Name',
      affiliation: 'Affiliation',
      description: 'Description'
    })
    cy.customMount(<CollectionInfo collection={collection} />)

    cy.findByRole('heading', { name: 'Collection Name' }).should('exist')
    cy.findByText('(Affiliation)').should('exist')
    cy.findByText('Description').should('exist')
  })

  it('does not render affiliation when it is not present', () => {
    const collection = CollectionMother.create({
      affiliation: undefined
    })
    cy.customMount(<CollectionInfo collection={collection} />)

    cy.findByText('(Affiliation)').should('not.exist')
  })

  it('does not render description when it is not present', () => {
    const collection = CollectionMother.create({
      description: undefined
    })
    cy.customMount(<CollectionInfo collection={collection} />)

    cy.findByText('Description').should('not.exist')
  })
})
