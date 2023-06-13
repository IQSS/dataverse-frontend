import { DatasetMother } from '../../../dataset/domain/models/DatasetMother'
import { DatasetMetadata } from '../../../../../src/sections/dataset/dataset-metadata/DatasetMetadata'
import {
  ANONYMIZED_FIELD_VALUE,
  MetadataBlockName
} from '../../../../../src/dataset/domain/models/Dataset'
import { AnonymizedContext } from '../../../../../src/sections/dataset/anonymized/AnonymizedContext'
import { AnonymizedProvider } from '../../../../../src/sections/dataset/anonymized/AnonymizedProvider'
import {
  isArrayOfObjects,
  metadataFieldValueToString
} from '../../../../../src/sections/dataset/dataset-metadata/dataset-metadata-fields/DatasetMetadataFieldValue'

describe('DatasetMetadata', () => {
  it('renders the metadata blocks sections titles correctly', () => {
    const mockDataset = DatasetMother.create()
    const mockMetadataBlocks = mockDataset.metadataBlocks

    cy.viewport(1280, 720)

    cy.fixture('metadataTranslations').then((t) => {
      cy.customMount(
        <DatasetMetadata
          persistentId={mockDataset.persistentId}
          metadataBlocks={mockMetadataBlocks}
        />
      )

      mockMetadataBlocks.forEach((metadataBlock) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const titleItem = cy.findByRole('button', { name: t[metadataBlock.name].name })
        titleItem.should('exist')
      })
    })
  })

  it('renders the metadata blocks title correctly', () => {
    const mockDataset = DatasetMother.create()
    const mockMetadataBlocks = mockDataset.metadataBlocks

    cy.viewport(1280, 720)

    cy.fixture('metadataTranslations').then((t) => {
      cy.customMount(
        <DatasetMetadata
          persistentId={mockDataset.persistentId}
          metadataBlocks={mockMetadataBlocks}
        />
      )

      mockMetadataBlocks.forEach((metadataBlock, index) => {
        if (index !== 0) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          cy.findByRole('button', { name: t[metadataBlock.name].name }).click()
        }

        Object.entries(metadataBlock.fields).forEach(([metadataFieldName]) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          const fieldTitle = cy.findAllByText(
            t[metadataBlock.name].datasetField[metadataFieldName].name as string
          )
          fieldTitle.should('exist')
        })
      })
    })
  })

  it('renders the metadata blocks description correctly', () => {
    const mockDataset = DatasetMother.create()
    const mockMetadataBlocks = mockDataset.metadataBlocks

    cy.viewport(1280, 720)

    cy.fixture('metadataTranslations').then((t) => {
      cy.customMount(
        <DatasetMetadata
          persistentId={mockDataset.persistentId}
          metadataBlocks={mockMetadataBlocks}
        />
      )

      mockMetadataBlocks.forEach((metadataBlock, index) => {
        if (index !== 0) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          cy.findByRole('button', { name: t[metadataBlock.name].name }).click()
        }

        Object.entries(metadataBlock.fields).forEach(([metadataFieldName]) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          cy.findAllByText(t[metadataBlock.name].datasetField[metadataFieldName].name as string)
            .siblings('span')
            .trigger('mouseover')

          const fieldDescription = cy.findAllByText(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            t[metadataBlock.name].datasetField[metadataFieldName].description
          )
          fieldDescription.should('exist')
        })
      })
    })
  })

  it('renders the metadata blocks values correctly', () => {
    const mockDataset = DatasetMother.create()
    const mockMetadataBlocks = mockDataset.metadataBlocks

    cy.viewport(1280, 720)

    cy.fixture('metadataTranslations').then((t) => {
      cy.customMount(
        <DatasetMetadata
          persistentId={mockDataset.persistentId}
          metadataBlocks={mockMetadataBlocks}
        />
      )

      mockMetadataBlocks.forEach((metadataBlock, index) => {
        if (index !== 0) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          cy.findByRole('button', { name: t[metadataBlock.name].name }).click()
        }

        Object.entries(metadataBlock.fields).forEach(([, metadataFieldValue]) => {
          const metadataFieldValueString = metadataFieldValueToString(metadataFieldValue)

          if (isArrayOfObjects(metadataFieldValue)) {
            metadataFieldValueString.split(' \n \n').forEach((fieldValue) => {
              cy.findAllByText(fieldValue).should('exist')
            })
            return
          }

          const fieldValue = cy.findAllByText(metadataFieldValueString, {
            exact: false
          })
          fieldValue.should('exist')
        })
      })
    })
  })

  it('renders the metadata blocks in anonymized view', () => {
    const mockDataset = DatasetMother.createAnonymized()
    const mockAnonymizedMetadataBlocks = mockDataset.metadataBlocks

    cy.customMount(
      <AnonymizedProvider>
        <AnonymizedContext.Consumer>
          {({ setAnonymizedView }) => {
            setAnonymizedView(true)
            return (
              <DatasetMetadata
                persistentId={mockDataset.persistentId}
                metadataBlocks={mockAnonymizedMetadataBlocks}
              />
            )
          }}
        </AnonymizedContext.Consumer>
      </AnonymizedProvider>
    )

    cy.findAllByText(ANONYMIZED_FIELD_VALUE).should('exist')
  })

  it('shows the Persistent Identifier as part of the Citation Metadata', () => {
    const mockDataset = DatasetMother.create()
    const mockMetadataBlocks = mockDataset.metadataBlocks

    cy.viewport(1280, 720)

    cy.fixture('metadataTranslations').then((t) => {
      cy.customMount(
        <DatasetMetadata
          persistentId={mockDataset.persistentId}
          metadataBlocks={mockMetadataBlocks}
        />
      )

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      cy.findByRole('button', { name: t[MetadataBlockName.CITATION].name }).should('exist')

      cy.findByText('Persistent Identifier').should('exist')
      cy.findByText(mockDataset.persistentId).should('exist')
    })
  })

  it('shows a tip if the translation exists', () => {
    const mockDataset = DatasetMother.create()
    const mockMetadataBlocks = mockDataset.metadataBlocks

    cy.viewport(1280, 720)

    cy.fixture('metadataTranslations').then((t) => {
      cy.customMount(
        <DatasetMetadata
          persistentId={mockDataset.persistentId}
          metadataBlocks={mockMetadataBlocks}
        />
      )

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      cy.findByRole('button', { name: t[MetadataBlockName.CITATION].name }).should('exist')

      cy.findByText(t[MetadataBlockName.CITATION].datasetField.datasetContact.tip as string).should(
        'exist'
      )
    })
  })
})
