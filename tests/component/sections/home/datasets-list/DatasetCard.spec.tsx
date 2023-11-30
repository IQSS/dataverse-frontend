import { DatasetPreviewMother } from '../../../dataset/domain/models/DatasetPreviewMother'
import { DatasetCard } from '../../../../../src/sections/home/datasets-list/DatasetCard'

describe('DatasetCard', () => {
  it('should render the card', () => {
    const dataset = DatasetPreviewMother.create()
    cy.customMount(<DatasetCard dataset={dataset} />)

    cy.findByRole('link', { name: dataset.title }).should('exist')
  })
})
