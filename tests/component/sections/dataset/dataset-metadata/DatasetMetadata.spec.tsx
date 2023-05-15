import { DatasetMother } from '../../../dataset/domain/models/DatasetMother'
import { DatasetMetadata } from '../../../../../src/sections/dataset/dataset-metadata/DatasetMetadata'

describe('DatasetMetadata', () => {
  const mockMetadataBlocks = DatasetMother.create().metadataBlocks

  it('renders the metadata blocks correctly', () => {
    cy.customMount(<DatasetMetadata metadataBlocks={mockMetadataBlocks} />)

    mockMetadataBlocks.forEach((metadataBlock) => {
      const titleItem = cy.findByRole('button', { name: metadataBlock.title })
      titleItem.should('exist')

      metadataBlock.fields.forEach((field) => {
        const fieldTitle = cy.findAllByText(field.title)
        fieldTitle.should('exist')

        fieldTitle.siblings('span').trigger('mouseover')

        const fieldDescription = cy.findAllByText(field.description)
        fieldDescription.should('exist')

        if (typeof field.value === 'string') {
          const fieldValue = cy.findAllByText(field.value)
          fieldValue.should('exist')
          return
        }

        field.value.forEach((subField) => {
          Object.values(subField).forEach((value) => {
            const fieldValue = cy.findAllByText(value)
            fieldValue.should('exist')
          })
        })
      })
    })
  })
})
