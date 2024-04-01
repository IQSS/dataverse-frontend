import { DatasetPreviewMother } from '../../../../dataset/domain/models/DatasetPreviewMother'
import { DatasetCard } from '../../../../../../src/sections/collection/datasets-list/dataset-card/DatasetCard'
import { DateHelper } from '../../../../../../src/shared/helpers/DateHelper'
import styles from '../../../../../../src/sections/collection/datasets-list/dataset-card/DatasetCard.module.scss'

describe('DatasetCard', () => {
  it('should render the card', () => {
    const dataset = DatasetPreviewMother.createWithThumbnail()
    cy.customMount(<DatasetCard dataset={dataset} />)

    cy.findByText(dataset.version.title).should('exist')

    cy.findByRole('img', { name: dataset.version.title }).should('exist')
    cy.findByText(DateHelper.toDisplayFormat(dataset.releaseOrCreateDate)).should('exist')
    cy.findByText(/Admin, Dataverse, 2023, "Dataset Title",/)
      .should('exist')
      .parent()
      .parent()
      .should('have.class', styles['citation-box'])
    cy.findByText(dataset.abbreviatedDescription).should('exist')
  })
})
