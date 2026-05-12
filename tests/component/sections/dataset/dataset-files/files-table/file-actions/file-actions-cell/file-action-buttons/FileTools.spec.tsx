import { ExternalToolsRepository } from '@/externalTools/domain/repositories/ExternalToolsRepository'
import { FileTools } from '@/sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-action-buttons/FileTools'
import { QueryParamKey } from '@/sections/Route.enum'
import { ExternalToolsProvider } from '@/shared/contexts/external-tools/ExternalToolsProvider'
import { ExternalToolsMother } from '@tests/component/externalTools/domain/models/ExternalToolsMother'
import { FileMetadataMother } from '@tests/component/files/domain/models/FileMetadataMother'
import { FilePreviewMother } from '@tests/component/files/domain/models/FilePreviewMother'
import { ToolScope, ToolType } from '@/externalTools/domain/models/ExternalTool'

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
    testExternalToolsRepository.getExternalTools = cy
      .stub()
      .resolves([
        ExternalToolsMother.createFilePreviewTool(),
        ExternalToolsMother.createFileQueryTool(),
        ExternalToolsMother.createFileExploreTool(),
        ExternalToolsMother.createFileConfigureTool()
      ])

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

    cy.findAllByRole('link').should('have.length', 2)
  })

  it('does not render external tool buttons when user cannot download the file', () => {
    cy.customMount(
      <ExternalToolsProvider externalToolsRepository={testExternalToolsRepository}>
        <FileTools file={testFilePreview} canDownloadFile={false} />
      </ExternalToolsProvider>
    )

    cy.findByRole('link', { name: `Preview ${testFilePreview.name}` }).should('not.exist')
    cy.findByRole('link', { name: `Query ${testFilePreview.name}` }).should('not.exist')
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

    cy.findByRole('link', { name: `Preview ${fileWithoutApplicableTools.name}` }).should(
      'not.exist'
    )
    cy.findByRole('link', { name: `Query ${fileWithoutApplicableTools.name}` }).should('not.exist')
  })

  it('does not render preview or query buttons for tools with unsupported requirements metadata', () => {
    testExternalToolsRepository.getExternalTools = cy.stub().resolves([
      {
        id: 77,
        displayName: 'Preview Tool With Requirements',
        description: 'Description for Preview Tool With Requirements',
        scope: ToolScope.File,
        types: [ToolType.Preview],
        contentType: 'text/plain',
        requirements: {
          auxFilesExist: [{ formatTag: 'DP', formatVersion: '1.0' }]
        }
      }
    ])

    cy.customMount(
      <ExternalToolsProvider externalToolsRepository={testExternalToolsRepository}>
        <FileTools file={testFilePreview} canDownloadFile={true} />
      </ExternalToolsProvider>
    )

    cy.findByRole('link', { name: `Preview ${testFilePreview.name}` }).should('not.exist')
  })
})
