import { DatasetMetadataBlock } from '../../../../../src/dataset/domain/models/Dataset'
import { SummaryFields } from '../../../../../src/sections/dataset/dataset-summary/SummaryFields'
import { DatasetMother } from '../../../dataset/domain/models/DatasetMother'

describe('DatasetSummary', () => {
  const summaryFieldsMock: DatasetMetadataBlock[] = DatasetMother.create().summaryFields

  it('renders the DatasetSummary fields', () => {
    cy.customMount(<SummaryFields summaryFields={summaryFieldsMock} />)

    cy.fixture('metadataTranslations').then((t) => {
      summaryFieldsMock.forEach((metadataBlock) => {
        Object.entries(metadataBlock.fields).forEach(([summaryFieldName, summaryFieldValue]) => {
          const translatedSummaryFieldName = t[metadataBlock.name].datasetField[summaryFieldName]
            .name as string
          const summaryField = cy.findByText(translatedSummaryFieldName).should('exist')

          summaryField.siblings('span').trigger('mouseover')

          const summaryFieldDescription = cy.findAllByText(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            t[metadataBlock.name].datasetField[summaryFieldName].description
          )
          summaryFieldDescription.should('exist')

          if (typeof summaryFieldValue === 'string') {
            cy.findAllByText(summaryFieldValue).should('exist')
            return
          }

          summaryFieldValue.forEach((subField) => {
            Object.values(subField).forEach((value) => {
              cy.findAllByText(value, { exact: false }).should('exist')
            })
          })
        })
      })
    })
  })
})
