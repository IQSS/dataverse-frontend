import { DatasetPreviewMother } from '../../../dataset/domain/models/DatasetPreviewMother'
import { DatasetCard } from '../../../../../src/sections/home/datasets-list/DatasetCard'
import { DateHelper } from '../../../../../src/shared/domain/helpers/DateHelper'
import styles from '../../../../../src/sections/home/datasets-list/DatasetCard.module.scss'

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
    cy.findByText(/Finch, Fiona, 2023, "Darwin's Finches"/)
      .should('exist')
      .parent()
      .should('have.class', styles['citation-box'])
    cy.findByText(dataset.abbreviatedDescription).should('exist')
  })

  it('should render the citation with the deaccessioned background if the dataset is deaccessioned', () => {
    const dataset = DatasetPreviewMother.createDeaccessioned()
    cy.customMount(<DatasetCard dataset={dataset} />)

    cy.findByText(/Finch, Fiona, 2023, "Darwin's Finches"/)
      .should('exist')
      .parent()
      .should('have.class', styles['citation-box-deaccessioned'])
  })
})
