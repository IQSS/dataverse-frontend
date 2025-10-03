import { ExternalToolsRepository } from '@/externalTools/domain/repositories/ExternalToolsRepository'
import { FileTools } from '@/sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-action-buttons/FileTools'
import { QueryParamKey } from '@/sections/Route.enum'
import { ExternalToolsProvider } from '@/shared/contexts/external-tools/ExternalToolsProvider'
import { ExternalToolsMother } from '@tests/component/externalTools/domain/models/ExternalToolsMother'
import { FileMetadataMother } from '@tests/component/files/domain/models/FileMetadataMother'
import { FilePreviewMother } from '@tests/component/files/domain/models/FilePreviewMother'

const testFilePreview = FilePreviewMother.createDefault() // text/plain file
const testExternalToolsRepository: ExternalToolsRepository = {} as ExternalToolsRepository

describe('FileTools', () => {
  beforeEach(() => {
    testExternalToolsRepository.getExternalTools = cy
      .stub()
      .resolves([
        ExternalToolsMother.createFilePreviewTool(),
        ExternalToolsMother.createFileQueryTool()
      ])
  })

  it('renders external tool buttons when user can download the file and there are applicable tools', () => {
    cy.customMount(
      <ExternalToolsProvider externalToolsRepository={testExternalToolsRepository}>
        <FileTools file={testFilePreview} canDownloadFile={true} />
      </ExternalToolsProvider>
    )

    cy.findByRole('link', { name: `Preview ${testFilePreview.name}` })
      .should('exist')
      .as('filePreviewButton')

    cy.findByRole('link', { name: `Query ${testFilePreview.name}` })
      .should('exist')
      .as('fileQueryButton')

    cy.get('@filePreviewButton')
      .should('have.attr', 'href')
      .and('include', `id=${testFilePreview.id}`)
      .and('include', `datasetVersion=${testFilePreview.datasetVersionNumber.toString()}`)
      .and('include', `${QueryParamKey.TOOL_TYPE}=preview`)

    cy.get('@fileQueryButton')
      .should('have.attr', 'href')
      .and('include', `id=${testFilePreview.id}`)
      .and('include', `datasetVersion=${testFilePreview.datasetVersionNumber.toString()}`)
      .and('include', `${QueryParamKey.TOOL_TYPE}=query`)
  })

  it('does not render external tool buttons when user cannot download the file', () => {
    cy.customMount(
      <ExternalToolsProvider externalToolsRepository={testExternalToolsRepository}>
        <FileTools file={testFilePreview} canDownloadFile={false} />
      </ExternalToolsProvider>
    )
  })

  it('does not render external tool buttons when there are no applicable tools for the file type', () => {
    // File type "tabular" has no applicable preview or query tools in the test repository
    const fileWithoutApplicableTools = FilePreviewMother.create({
      id: 2,
      metadata: FileMetadataMother.createTabular()
    })

    cy.customMount(
      <ExternalToolsProvider externalToolsRepository={testExternalToolsRepository}>
        <FileTools file={fileWithoutApplicableTools} canDownloadFile={true} />
      </ExternalToolsProvider>
    )
  })
})
