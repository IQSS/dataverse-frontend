import { ExternalToolsRepository } from '@/externalTools/domain/repositories/ExternalToolsRepository'
import {
  FileExploreOptions,
  FileQueryOptions
} from '@/sections/file/file-action-buttons/access-file-menu/FileToolOptions'
import { ExternalToolsProvider } from '@/shared/contexts/external-tools/ExternalToolsProvider'
import { ExternalToolsMother } from '@tests/component/externalTools/domain/models/ExternalToolsMother'

const testExternalToolsRepository: ExternalToolsRepository = {} as ExternalToolsRepository

describe('FileToolOptions', () => {
  beforeEach(() => {
    testExternalToolsRepository.getExternalTools = cy
      .stub()
      .resolves([
        ExternalToolsMother.createFileExploreTool(),
        ExternalToolsMother.createFileQueryTool()
      ])
  })

  it('renders the tool options if user has download permission and file explore tools are available and compatible with the type', () => {
    cy.customMount(
      <ExternalToolsProvider externalToolsRepository={testExternalToolsRepository}>
        <FileExploreOptions fileId={1} userHasDownloadPermission={true} fileType="text/plain" />
      </ExternalToolsProvider>
    )

    cy.findByText('Query Options').should('not.exist')
    cy.findByText('Explore Options').should('exist')
    cy.findByText('File Explore Tool').should('exist')
  })

  it('renders the tool options if user has download permission and file query tools are available and compatible with the type', () => {
    cy.customMount(
      <ExternalToolsProvider externalToolsRepository={testExternalToolsRepository}>
        <FileQueryOptions fileId={1} userHasDownloadPermission={true} fileType="text/plain" />
      </ExternalToolsProvider>
    )

    cy.findByText('Explore Options').should('not.exist')
    cy.findByText('Query Options').should('exist')
    cy.findByText('File Query Tool').should('exist')
  })

  it('does not render the tool options if user lacks download permission', () => {
    cy.customMount(
      <ExternalToolsProvider externalToolsRepository={testExternalToolsRepository}>
        <FileQueryOptions fileId={1} userHasDownloadPermission={false} fileType="text/plain" />
      </ExternalToolsProvider>
    )

    cy.findByText('Explore Options').should('not.exist')
    cy.findByText('Query Options').should('not.exist')
  })

  it('does not render the tool options if there are not applicable tools for the file type', () => {
    cy.customMount(
      <ExternalToolsProvider externalToolsRepository={testExternalToolsRepository}>
        <FileQueryOptions fileId={1} userHasDownloadPermission={true} fileType="application/pdf" />
      </ExternalToolsProvider>
    )

    cy.findByText('Explore Options').should('not.exist')
    cy.findByText('Query Options').should('not.exist')
  })
})
