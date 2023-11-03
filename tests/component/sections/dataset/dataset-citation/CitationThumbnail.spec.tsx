import { DatasetPublishingStatus } from '../../../../../src/dataset/domain/models/Dataset'
import { CitationThumbnail } from '../../../../../src/sections/dataset/dataset-citation/CitationThumbnail'

describe('CitationThumbnail', () => {
  it('renders the dataset icon when there is no thumbnail', () => {
    cy.customMount(
      <CitationThumbnail
        title="Dataset title"
        publishingStatus={DatasetPublishingStatus.RELEASED}
      />
    )

    cy.findByLabelText('icon-dataset').should('exist')
  })

  it('renders the dataset icon when the dataset is deaccessioned', () => {
    cy.customMount(
      <CitationThumbnail
        title="Dataset title"
        thumbnail="https://example.com/image.png"
        publishingStatus={DatasetPublishingStatus.DEACCESSIONED}
      />
    )

    cy.findByLabelText('icon-dataset').should('exist')
  })

  it('renders the dataset thumbnail when there is one and the dataset is not deaccessioned', () => {
    cy.customMount(
      <CitationThumbnail
        thumbnail="https://example.com/image.png"
        title="Dataset title"
        publishingStatus={DatasetPublishingStatus.RELEASED}
      />
    )

    cy.findByRole('img', { name: 'Dataset title' }).should('exist')
  })
})
