import { DatasetMetadataFieldInstruction } from '../../../../../src/sections/dataset/dataset-template/DatasetMetadataFieldInstruction'
import { DatasetTemplateProvider } from '../../../../../src/sections/dataset/dataset-template/DatasetTemplateProvider'
import { DatasetTemplateMother } from '../../../dataset/domain/models/DatasetTemplateMother'
import { DatasetTemplateRepository } from '../../../../../src/dataset/domain/repositories/DatasetTemplateRepository'
import { DatasetTemplateContext } from '../../../../../src/sections/dataset/dataset-template/DatasetTemplateContext'

describe('DatasetMetadataFieldInstruction', () => {
  it('renders the metadata field instruction when it exists', () => {
    const fieldName = 'fieldName'
    const instruction = 'Sample instruction'
    const templateId = 'template-id'
    const testDatasetTemplate = DatasetTemplateMother.create({
      id: templateId,
      metadataBlocksInstructions: [
        {
          [fieldName]: instruction
        }
      ]
    })
    const datasetTemplateRepository: DatasetTemplateRepository = {} as DatasetTemplateRepository
    datasetTemplateRepository.getById = cy.stub().resolves(testDatasetTemplate)

    cy.customMount(
      <DatasetTemplateProvider repository={datasetTemplateRepository}>
        <DatasetTemplateContext.Consumer>
          {({ template, setTemplateId }) => {
            setTemplateId(templateId)
            return <DatasetMetadataFieldInstruction metadataFieldName={fieldName} />
          }}
        </DatasetTemplateContext.Consumer>
      </DatasetTemplateProvider>
    )

    cy.findByText(instruction).should('exist')
  })

  it('renders nothing when there is no dataset template', () => {
    const fieldName = 'fieldName'
    const instruction = 'Sample instruction'
    const testDatasetTemplate = DatasetTemplateMother.create({
      metadataBlocksInstructions: [
        {
          [fieldName]: instruction
        }
      ]
    })
    const datasetTemplateRepository: DatasetTemplateRepository = {} as DatasetTemplateRepository
    datasetTemplateRepository.getById = cy.stub().resolves(testDatasetTemplate)

    cy.customMount(
      <DatasetTemplateProvider repository={datasetTemplateRepository}>
        <DatasetTemplateContext.Consumer>
          {({ template, setTemplateId }) => {
            setTemplateId(undefined)
            return <DatasetMetadataFieldInstruction metadataFieldName={fieldName} />
          }}
        </DatasetTemplateContext.Consumer>
      </DatasetTemplateProvider>
    )

    cy.findByText(instruction).should('not.exist')
  })
})
