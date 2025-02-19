import { DatasetSummary } from '../../../../../src/sections/dataset/dataset-summary/DatasetSummary'
import {
  DatasetMetadataBlock,
  DatasetLicense
} from '../../../../../src/dataset/domain/models/Dataset'
import { DatasetMother } from '../../../dataset/domain/models/DatasetMother'
import { MetadataBlockInfoRepository } from '../../../../../src/metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { MetadataBlockInfoMother } from '../../../metadata-block-info/domain/models/MetadataBlockInfoMother'

describe('DatasetSummary', () => {
  const licenseMock: DatasetLicense | undefined = DatasetMother.create().license
  const summaryFieldsMock: DatasetMetadataBlock[] = DatasetMother.create().summaryFields
  const metadataBlockInfoMock = MetadataBlockInfoMother.create()
  const metadataBlockInfoRepository: MetadataBlockInfoRepository = {} as MetadataBlockInfoRepository

  it('renders the DatasetSummary fields', () => {
    metadataBlockInfoRepository.getByName = cy.stub().resolves(metadataBlockInfoMock)

    cy.mount(
      <DatasetSummary
        metadataBlockInfoRepository={metadataBlockInfoRepository}
        summaryFields={summaryFieldsMock}
        license={licenseMock}
      />
    )

    cy.fixture('metadataTranslations').then((t) => {
      summaryFieldsMock.forEach((metadataBlock) => {
        Object.entries(metadataBlock.fields).forEach(([summaryFieldName]) => {
          const translatedSummaryFieldName = t[metadataBlock.name].datasetField[summaryFieldName]
            .name as string
          cy.findByText(translatedSummaryFieldName).should('exist')
        })
      })
    })

    cy.get('img').should('exist')
    licenseMock && cy.findByText(licenseMock.name).should('exist')
  })

  it('renders an empty span if there is an error getting the metadata block display info', () => {
    metadataBlockInfoRepository.getByName = cy
      .stub()
      .rejects(new Error('Error getting metadata block display info'))

    cy.customMount(
      <DatasetSummary
        metadataBlockInfoRepository={metadataBlockInfoRepository}
        summaryFields={summaryFieldsMock}
        license={licenseMock}
      />
    )

    cy.findAllByTestId('summary-block-display-format-error').should('exist')
  })
})
