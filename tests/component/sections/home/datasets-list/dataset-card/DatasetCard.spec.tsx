import { DatasetPreviewMother } from '../../../../dataset/domain/models/DatasetPreviewMother'
import { DatasetCard } from '../../../../../../src/sections/home/datasets-list/dataset-card/DatasetCard'
import { DateHelper } from '../../../../../../src/shared/domain/helpers/DateHelper'
import styles from '../../../../../../src/sections/home/datasets-list/dataset-card/DatasetCard.module.scss'

describe('DatasetCard', () => {
  it('should render the card', () => {
    const dataset = DatasetPreviewMother.createWithThumbnail()
    cy.customMount(<DatasetCard dataset={dataset} />)

    cy.findByText(dataset.title).should('exist')

    cy.findByRole('img', { name: dataset.title }).should('exist')
    cy.findByText(DateHelper.toDisplayFormat(dataset.releaseOrCreateDate)).should('exist')
    cy.findByText(/Finch, Fiona, 2023, "Darwin's Finches"/)
      .should('exist')
      .parent()
      .parent()
      .should('have.class', styles['citation-box'])
    cy.findByText(dataset.abbreviatedDescription).should('exist')
  })
})
