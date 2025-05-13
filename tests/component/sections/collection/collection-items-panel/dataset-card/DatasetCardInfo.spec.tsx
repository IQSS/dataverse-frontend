import { DatasetCardInfo } from '@/sections/collection/collection-items-panel/items-list/dataset-card/DatasetCardInfo'
import { DatasetItemTypePreviewMother } from '../../../../dataset/domain/models/DatasetItemTypePreviewMother'
import { DateHelper } from '@/shared/helpers/DateHelper'
import styles from '@/sections/collection/collection-items-panel/items-list/dataset-card/DatasetCard.module.scss'

describe('DatasetCardInfo', () => {
  it('should render the dataset info', () => {
    const dataset = DatasetItemTypePreviewMother.createDraft()
    cy.customMount(
      <DatasetCardInfo
        version={dataset.version}
        releaseOrCreateDate={dataset.releaseOrCreateDate}
        description={dataset.description}
      />
    )

    cy.findByText(DateHelper.toDisplayFormat(dataset.releaseOrCreateDate)).should('exist')
    cy.findByText(/Admin, Dataverse, 2023, "Dataset Title",/)
      .should('exist')
      .parent()
      .parent()
      .should('have.class', styles['citation-box'])
    cy.findByText(dataset.description).should('exist')
  })

  it('should render the citation with the deaccessioned background if the dataset is deaccessioned', () => {
    const dataset = DatasetItemTypePreviewMother.createDeaccessioned()
    cy.customMount(
      <DatasetCardInfo
        version={dataset.version}
        releaseOrCreateDate={dataset.releaseOrCreateDate}
        description={dataset.description}
      />
    )

    cy.findByText(/Admin, Dataverse, 2023, "Dataset Title",/)
      .should('exist')
      .parent()
      .parent()
      .should('have.class', styles['deaccesioned'])
  })
})
