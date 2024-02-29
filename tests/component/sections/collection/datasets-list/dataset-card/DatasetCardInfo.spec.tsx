import { DatasetPreviewMother } from '../../../../dataset/domain/models/DatasetPreviewMother'
import { DateHelper } from '../../../../../../src/shared/helpers/DateHelper'
import styles from '../../../../../../src/sections/collection/datasets-list/dataset-card/DatasetCard.module.scss'
import { DatasetCardInfo } from '../../../../../../src/sections/collection/datasets-list/dataset-card/DatasetCardInfo'

describe('DatasetCardInfo', () => {
  it('should render the dataset info', () => {
    const dataset = DatasetPreviewMother.createDraft()
    cy.customMount(
      <DatasetCardInfo
        version={dataset.version}
        releaseOrCreateDate={dataset.releaseOrCreateDate}
        abbreviatedDescription={dataset.abbreviatedDescription}
      />
    )

    cy.findByText(DateHelper.toDisplayFormat(dataset.releaseOrCreateDate)).should('exist')
    cy.findByText(/Admin, Dataverse, 2023, "Dataset Title",/)
      .should('exist')
      .parent()
      .parent()
      .should('have.class', styles['citation-box'])
    cy.findByText(dataset.abbreviatedDescription).should('exist')
  })

  it('should render the citation with the deaccessioned background if the dataset is deaccessioned', () => {
    const dataset = DatasetPreviewMother.createDeaccessioned()
    cy.customMount(
      <DatasetCardInfo
        version={dataset.version}
        releaseOrCreateDate={dataset.releaseOrCreateDate}
        abbreviatedDescription={dataset.abbreviatedDescription}
      />
    )

    cy.findByText(/Admin, Dataverse, 2023, "Dataset Title",/)
      .should('exist')
      .parent()
      .parent()
      .should('have.class', styles['citation-box-deaccessioned'])
  })
})
