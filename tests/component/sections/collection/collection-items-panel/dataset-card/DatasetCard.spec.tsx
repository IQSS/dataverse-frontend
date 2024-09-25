import { DatasetCard } from '@/sections/collection/collection-items-panel/items-list/dataset-card/DatasetCard'
import { DatasetPreviewMother } from '@tests/component/dataset/domain/models/DatasetPreviewMother'
import { DateHelper } from '@/shared/helpers/DateHelper'

describe('DatasetCard', () => {
  it('should render the card', () => {
    const dataset = DatasetPreviewMother.createWithThumbnail()

    cy.customMount(<DatasetCard datasetPreview={dataset} />)

    cy.findByText(dataset.version.title).should('exist')

    cy.findByRole('img', { name: dataset.version.title }).should('exist')
    cy.findByText(DateHelper.toDisplayFormat(dataset.releaseOrCreateDate)).should('exist')
    cy.findByText(/Admin, Dataverse, 2023, "Dataset Title",/).should('exist')
  })
})
