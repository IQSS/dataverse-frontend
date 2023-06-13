import { DatasetSummary } from '../../../../../src/sections/dataset/dataset-summary/DatasetSummary'
import {
  DatasetMetadataBlock,
  DatasetLicense
} from '../../../../../src/dataset/domain/models/Dataset'
import { DatasetMother } from '../../../dataset/domain/models/DatasetMother'

describe('DatasetSummary', () => {
  const licenseMock: DatasetLicense = DatasetMother.create().license
  const summaryFieldsMock: DatasetMetadataBlock[] = DatasetMother.create().summaryFields

  it('renders the DatasetSummary fields', () => {
    cy.mount(<DatasetSummary summaryFields={summaryFieldsMock} license={licenseMock} />)

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
    cy.findByText(licenseMock.name).should('exist')
  })
})
