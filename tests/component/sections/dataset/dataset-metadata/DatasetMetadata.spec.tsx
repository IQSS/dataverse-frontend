import { DatasetMother } from '../../../dataset/domain/models/DatasetMother'
import { DatasetMetadata } from '../../../../../src/sections/dataset/dataset-metadata/DatasetMetadata'
import { ANONYMIZED_FIELD_VALUE } from '../../../../../src/dataset/domain/models/Dataset'
import { AnonymizedContext } from '../../../../../src/sections/dataset/anonymized/AnonymizedContext'
import { AnonymizedProvider } from '../../../../../src/sections/dataset/anonymized/AnonymizedProvider'

describe('DatasetMetadata', () => {
  it('renders the metadata blocks correctly', () => {
    const mockMetadataBlocks = DatasetMother.create().metadataBlocks

    cy.viewport(1280, 720)

    cy.fixture('metadataTranslations').then((t) => {
      cy.customMount(<DatasetMetadata metadataBlocks={mockMetadataBlocks} />)

      mockMetadataBlocks.forEach((metadataBlock, index) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const titleItem = cy.findByRole('button', { name: t[metadataBlock.name].name })
        titleItem.should('exist')

        if (index !== 0) {
          titleItem.click()
        }

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
              const fieldValue = cy.findAllByText(value, { exact: false })
              fieldValue.should('exist')
            })
          })
        })
      })
    })
  })

  it('renders the metadata blocks in anonymized view', () => {
    const mockAnonymizedMetadataBlocks = DatasetMother.createAnonymized().metadataBlocks

    cy.customMount(
      <AnonymizedProvider>
        <AnonymizedContext.Consumer>
          {({ setAnonymizedView }) => {
            setAnonymizedView(true)
            return <DatasetMetadata metadataBlocks={mockAnonymizedMetadataBlocks} />
          }}
        </AnonymizedContext.Consumer>
      </AnonymizedProvider>
    )

    cy.findAllByText(ANONYMIZED_FIELD_VALUE).should('exist')
  })
})
