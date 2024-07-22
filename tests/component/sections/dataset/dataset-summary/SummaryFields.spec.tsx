import { DatasetMetadataBlock } from '../../../../../src/dataset/domain/models/Dataset'
import { SummaryFields } from '../../../../../src/sections/dataset/dataset-summary/SummaryFields'
import { DatasetMother } from '../../../dataset/domain/models/DatasetMother'
import {
  isArrayOfObjects,
  metadataFieldValueToDisplayFormat
} from '../../../../../src/sections/dataset/dataset-metadata/dataset-metadata-fields/DatasetMetadataFieldValueFormatted'
import { MetadataBlockInfoMother } from '../../../metadata-block-info/domain/models/MetadataBlockInfoMother'
import { MetadataBlockInfoRepository } from '../../../../../src/metadata-block-info/domain/repositories/MetadataBlockInfoRepository'

describe('DatasetSummary', () => {
  it('renders the DatasetSummary fields', () => {
    const summaryFieldsMock: DatasetMetadataBlock[] = DatasetMother.create().summaryFields
    const metadataBlockInfoMock = MetadataBlockInfoMother.create()
    const metadataBlockInfoRepository: MetadataBlockInfoRepository =
      {} as MetadataBlockInfoRepository
    metadataBlockInfoRepository.getByName = cy.stub().resolves(metadataBlockInfoMock)

    cy.customMount(
      <SummaryFields
        summaryFields={summaryFieldsMock}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
      />
    )

    cy.fixture('metadataTranslations').then((t) => {
      summaryFieldsMock.forEach((metadataBlock) => {
        Object.entries(metadataBlock.fields).forEach(([summaryFieldName, summaryFieldValue]) => {
          const translatedSummaryFieldName = t[metadataBlock.name].datasetField[summaryFieldName]
            .name as string
          const summaryField = cy.findByText(translatedSummaryFieldName).should('exist')

          summaryField.siblings('div').trigger('mouseover')

          const summaryFieldDescription = cy.findAllByText(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            t[metadataBlock.name].datasetField[summaryFieldName].description
          )
          summaryFieldDescription.should('exist')

          const summaryFieldValueString = metadataFieldValueToDisplayFormat(
            summaryFieldName,
            summaryFieldValue,
            metadataBlockInfoMock
          )

          if (isArrayOfObjects(summaryFieldValue)) {
            summaryFieldValueString.split(' \n \n').forEach((fieldValue) => {
              cy.findAllByText(fieldValue).should('exist')
            })
            return
          }

          const fieldValue = cy.findAllByText(summaryFieldValueString, {
            exact: false
          })
          fieldValue.should('exist')
        })
      })
    })
  })
})
