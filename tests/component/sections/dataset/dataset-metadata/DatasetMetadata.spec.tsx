import { DatasetMother } from '../../../dataset/domain/models/DatasetMother'
import { DatasetMetadata } from '../../../../../src/sections/dataset/dataset-metadata/DatasetMetadata'

function camelCaseToTitleCase(camelCase: string) {
  return camelCase
    .replace(/([A-Z])/g, (match) => ` ${match}`)
    .replace(/^./, (match) => match.toUpperCase())
}

describe('DatasetMetadata', () => {
  const mockMetadataBlocks = DatasetMother.create().metadataBlocks

  it('renders the metadata blocks correctly', () => {
    cy.customMount(<DatasetMetadata metadataBlocks={mockMetadataBlocks} />)

    mockMetadataBlocks.forEach((metadataBlock) => {
      const accordionItem = cy.findByRole('button', { name: metadataBlock.title })
      accordionItem.should('exist')

      metadataBlock.fields.forEach((field) => {
        Object.entries(field).map(([key, value]) => {
          const fieldsTitles = cy.findAllByText(camelCaseToTitleCase(key))
          fieldsTitles.should('exist')

          // Simple field
          if (typeof value === 'string') {
            cy.findByText(value).should('exist')
            return
          }

          // Compound Field
          Object.entries(value).map(([subKey, subValue]) => {
            cy.findAllByText(camelCaseToTitleCase(subKey)).should('exist')

            cy.findByText(subValue).should('exist')
          })
        })
      })
    })
  })
})
