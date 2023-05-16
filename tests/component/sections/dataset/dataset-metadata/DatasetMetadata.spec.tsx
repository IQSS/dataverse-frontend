import { DatasetMother } from '../../../dataset/domain/models/DatasetMother'
import { DatasetMetadata } from '../../../../../src/sections/dataset/dataset-metadata/DatasetMetadata'

describe('DatasetMetadata', () => {
  const mockMetadataBlocks = DatasetMother.create().metadataBlocks

  it('renders the metadata blocks correctly', () => {
    cy.viewport(1280, 720)

    cy.fixture('metadataTranslations').then((t) => {
      cy.customMount(<DatasetMetadata metadataBlocks={mockMetadataBlocks} />)

      mockMetadataBlocks.forEach((metadataBlock) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const titleItem = cy.findByRole('button', { name: t[metadataBlock.name].name })
        titleItem.should('exist')

        Object.entries(metadataBlock.fields).forEach(([fieldName, field]) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          const fieldTitle = cy.findAllByText(t[metadataBlock.name].datasetField[fieldName].name)
          fieldTitle.should('exist')

          fieldTitle.siblings('span').trigger('mouseover')

          const fieldDescription = cy.findAllByText(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            t[metadataBlock.name].datasetField[fieldName].description
          )
          fieldDescription.should('exist')

          if (typeof field === 'string') {
            const fieldValue = cy.findAllByText(field)
            fieldValue.should('exist')
            return
          }

          field.forEach((subField) => {
            Object.values(subField).forEach((value) => {
              const fieldValue = cy.findAllByText(value)
              fieldValue.should('exist')
            })
          })
        })
      })
    })
  })
})
