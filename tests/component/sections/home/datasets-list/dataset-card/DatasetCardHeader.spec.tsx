import { DatasetCardHeader } from '../../../../../../src/sections/home/datasets-list/dataset-card/DatasetCardHeader'
import { DatasetPreviewMother } from '../../../../dataset/domain/models/DatasetPreviewMother'

describe('DatasetCardHeader', () => {
  it('should render the header', () => {
    const dataset = DatasetPreviewMother.create()
    cy.customMount(<DatasetCardHeader dataset={dataset} />)

    cy.findByText(dataset.title)
      .should('exist')
      .should('have.attr', 'href', `/datasets?persistentId=${dataset.persistentId}`)
    dataset.labels.forEach((label) => {
      cy.findByText(label.value).should('exist')
    })
  })
})
