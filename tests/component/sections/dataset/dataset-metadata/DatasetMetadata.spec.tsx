import { DatasetMother } from '../../../dataset/domain/models/DatasetMother'
import { DatasetMetadata } from '../../../../../src/sections/dataset/dataset-metadata/DatasetMetadata'
import {
  ANONYMIZED_FIELD_VALUE,
  MetadataBlockName
} from '../../../../../src/dataset/domain/models/Dataset'
import { AnonymizedContext } from '../../../../../src/sections/dataset/anonymized/AnonymizedContext'
import {
  isArrayOfObjects,
  metadataFieldValueToDisplayFormat
} from '../../../../../src/sections/dataset/dataset-metadata/dataset-metadata-fields/DatasetMetadataFieldValueFormatted'
import { MetadataBlockInfoProvider } from '../../../../../src/sections/dataset/metadata-block-info/MetadataBlockProvider'
import { MetadataBlockInfoRepository } from '../../../../../src/metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { MetadataBlockInfoMother } from '../../../metadata-block-info/domain/models/MetadataBlockInfoMother'
import { METADATA_FIELD_DISPLAY_FORMAT_NAME_PLACEHOLDER } from '../../../../../src/metadata-block-info/domain/models/MetadataBlockInfo'

const extractLinksFromText = (text: string): { text: string; link: string }[] => {
  const linkFormat = /(?<!!) \[(.*?)\]\((.*?)\)/g
  const matchesLinkFormat = text.match(linkFormat)

  if (!matchesLinkFormat) {
    return []
  }

  return matchesLinkFormat
    .map((match) => {
      const matchResult = match.match(/\[(.*?)\]\((.*?)\)/)
      if (matchResult) {
        const [, text, link] = matchResult
        return { text, link }
      }
      return null
    })
    .filter((match) => match !== null) as { text: string; link: string }[]
}

const extractImagesFromText = (text: string): string[] => {
  return text.match(/!\[(.*?)\]\((.*?)\)/g) || []
}

describe('DatasetMetadata', () => {
  const checkMetadataFieldValue = (metadataFieldName: string, metadataFieldValue: string) => {
    const extractedLinks = extractLinksFromText(metadataFieldValue)
    const extractedImages = extractImagesFromText(metadataFieldValue)
    const notPlainText = extractedLinks.length > 0 || extractedImages

    if (notPlainText) {
      if (extractedLinks) {
        extractedLinks.forEach(({ text, link }) => {
          const translatedText = text.replaceAll(
            METADATA_FIELD_DISPLAY_FORMAT_NAME_PLACEHOLDER,
            metadataFieldName
          )
          cy.findByText(translatedText).should('exist')
          cy.findByText(translatedText).should('have.attr', 'href', link)
        })
      }
      if (extractedImages) {
        extractedImages.forEach((image) => {
          const [, altText, imageUrl] = image.match(/!\[(.*?)\]\((.*?)\)/) || []
          const translatedAltText = altText.replaceAll(
            METADATA_FIELD_DISPLAY_FORMAT_NAME_PLACEHOLDER,
            metadataFieldName
          )
          cy.findByAltText(translatedAltText).should('exist')
          cy.findByAltText(translatedAltText).should('have.attr', 'src', imageUrl)
        })
      }
    } else {
      cy.findByText(metadataFieldValue).should('exist')
    }
  }

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
            .siblings('div')
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
    const metadataBlockInfoMock = MetadataBlockInfoMother.create()
    const metadataBlockInfoRepository: MetadataBlockInfoRepository =
      {} as MetadataBlockInfoRepository
    metadataBlockInfoRepository.getByName = cy.stub().resolves(metadataBlockInfoMock)
    const mockDataset = DatasetMother.create()
    const mockMetadataBlocks = mockDataset.metadataBlocks

    cy.viewport(1280, 720)

    cy.fixture('metadataTranslations').then((t) => {
      cy.customMount(
        <MetadataBlockInfoProvider repository={metadataBlockInfoRepository}>
          <DatasetMetadata
            persistentId={mockDataset.persistentId}
            metadataBlocks={mockMetadataBlocks}
          />
        </MetadataBlockInfoProvider>
      )

      mockMetadataBlocks.forEach((metadataBlock, index) => {
        if (index !== 0) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          cy.findByRole('button', { name: t[metadataBlock.name].name }).click()
        }

        Object.entries(metadataBlock.fields).forEach(([metadataFieldName, metadataFieldValue]) => {
          const metadataFieldNameTranslated = t[metadataBlock.name].datasetField[metadataFieldName]
            .name as string
          const metadataFieldValueString = metadataFieldValueToDisplayFormat(
            metadataFieldName,
            metadataFieldValue,
            metadataBlockInfoMock
          )

          if (isArrayOfObjects(metadataFieldValue)) {
            metadataFieldValueString.split(' \n \n').forEach((fieldValue) => {
              checkMetadataFieldValue(metadataFieldNameTranslated, fieldValue)
            })
            return
          }

          checkMetadataFieldValue(metadataFieldNameTranslated, metadataFieldValueString)
        })
      })
    })
  })

  it('renders the metadata blocks in anonymized view', () => {
    const setAnonymizedView = () => {}
    const mockDataset = DatasetMother.createAnonymized()
    const mockAnonymizedMetadataBlocks = mockDataset.metadataBlocks

    cy.customMount(
      <AnonymizedContext.Provider value={{ anonymizedView: true, setAnonymizedView }}>
        <DatasetMetadata
          persistentId={mockDataset.persistentId}
          metadataBlocks={mockAnonymizedMetadataBlocks}
        />
      </AnonymizedContext.Provider>
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
