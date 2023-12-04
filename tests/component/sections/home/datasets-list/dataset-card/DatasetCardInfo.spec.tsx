import { DatasetPreviewMother } from '../../../../dataset/domain/models/DatasetPreviewMother'
import { DateHelper } from '../../../../../../src/shared/domain/helpers/DateHelper'
import styles from '../../../../../../src/sections/home/datasets-list/dataset-card/DatasetCard.module.scss'
import { DatasetCardInfo } from '../../../../../../src/sections/home/datasets-list/dataset-card/DatasetCardInfo'

describe('DatasetCardInfo', () => {
  it('should render the dataset info', () => {
    const dataset = DatasetPreviewMother.create()
    cy.customMount(<DatasetCardInfo dataset={dataset} />)

    cy.findByText(DateHelper.toDisplayFormat(dataset.releaseOrCreateDate)).should('exist')
    cy.findByText(/Finch, Fiona, 2023, "Darwin's Finches"/)
      .should('exist')
      .parent()
      .should('have.class', styles['citation-box'])
    cy.findByText(dataset.abbreviatedDescription).should('exist')
  })

  it('should render the citation with the deaccessioned background if the dataset is deaccessioned', () => {
    const dataset = DatasetPreviewMother.createDeaccessioned()
    cy.customMount(<DatasetCardInfo dataset={dataset} />)

    cy.findByText(/Finch, Fiona, 2023, "Darwin's Finches"/)
      .should('exist')
      .parent()
      .should('have.class', styles['citation-box-deaccessioned'])
  })
})
