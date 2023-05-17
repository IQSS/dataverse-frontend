import { DatasetTemplateRepository } from '../../../../../src/dataset/domain/repositories/DatasetTemplateRepository'
import { DatasetTemplateMother } from '../../../dataset/domain/models/DatasetTemplateMother'
import { DatasetTemplateProvider } from '../../../../../src/sections/dataset/dataset-template/DatasetTemplateProvider'
import { DatasetTemplateContext } from '../../../../../src/sections/dataset/dataset-template/DatasetTemplateContext'

describe('DatasetTemplateProvider', () => {
  it('fetches and sets the dataset template', () => {
    const templateId = 'template-id'
    const testDatasetTemplate = DatasetTemplateMother.create({ id: templateId })
    const datasetTemplateRepository: DatasetTemplateRepository = {} as DatasetTemplateRepository
    datasetTemplateRepository.getById = cy.stub().resolves(testDatasetTemplate)

    cy.mount(
      <DatasetTemplateProvider repository={datasetTemplateRepository}>
        <DatasetTemplateContext.Consumer>
          {({ template, setTemplateId }) => {
            setTemplateId(templateId)
            return template ? <>{template.id}</> : <></>
          }}
        </DatasetTemplateContext.Consumer>
      </DatasetTemplateProvider>
    )

    cy.findByText('template-id').should('exist')
    cy.wrap(datasetTemplateRepository.getById).should('have.been.called')
  })
})
