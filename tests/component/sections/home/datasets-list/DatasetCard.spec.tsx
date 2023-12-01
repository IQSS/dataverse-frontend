import { DatasetPreviewMother } from '../../../dataset/domain/models/DatasetPreviewMother'
import { DatasetCard } from '../../../../../src/sections/home/datasets-list/DatasetCard'
import { DateHelper } from '../../../../../src/shared/domain/helpers/DateHelper'

describe('DatasetCard', () => {
  it('should render the card', () => {
    const dataset = DatasetPreviewMother.createWithThumbnail()
    cy.customMount(<DatasetCard dataset={dataset} />)

    cy.findByText(dataset.title)
      .should('exist')
      .should('have.attr', 'href', `/datasets?persistentId=${dataset.persistentId}`)
    dataset.labels.forEach((label) => {
      cy.findByText(label.value).should('exist')
    })
    cy.findByRole('img', { name: dataset.title })
      .should('exist')
      .parent('a')
      .should('have.attr', 'href', `/datasets?persistentId=${dataset.persistentId}`)
    cy.findByText(DateHelper.toDisplayFormat(dataset.releaseOrCreateDate)).should('exist')
  })
})
