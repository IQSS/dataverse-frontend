import { DatasetThumbnail } from '../../../../../src/sections/dataset/dataset-citation/DatasetThumbnail'

describe('DatasetThumbnail', () => {
  it('renders the dataset icon when there is no thumbnail', () => {
    cy.customMount(<DatasetThumbnail title="Dataset title" />)

    cy.findByLabelText('icon-dataset').should('exist')
  })

  it('renders the dataset icon when the dataset is deaccessioned', () => {
    cy.customMount(
      <DatasetThumbnail
        title="Dataset title"
        thumbnail="https://example.com/image.png"
        isDeaccessioned
      />
    )

    cy.findByLabelText('icon-dataset').should('exist')
  })

  it('renders the dataset thumbnail when there is one and the dataset is not deaccessioned', () => {
    cy.customMount(
      <DatasetThumbnail thumbnail="https://example.com/image.png" title="Dataset title" />
    )

    cy.findByRole('img', { name: 'Dataset title' }).should('exist')
  })
})
