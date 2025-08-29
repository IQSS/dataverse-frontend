import { ExternalToolsRepository } from '@/externalTools/domain/repositories/ExternalToolsRepository'
import {
  FileExploreToolsOptions,
  FileQueryToolsOptions,
  FileConfigureToolsOptions
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
        ExternalToolsMother.createFileQueryTool(),
        ExternalToolsMother.createFileConfigureTool()
      ])
  })

  describe('FileExploreToolsOptions', () => {
    it('renders the tool options if file explore tools are available and compatible with the type', () => {
      cy.customMount(
        <ExternalToolsProvider externalToolsRepository={testExternalToolsRepository}>
          <FileExploreToolsOptions fileId={1} fileType="text/plain" />
        </ExternalToolsProvider>
      )

      cy.findByText('Query Options').should('not.exist')
      cy.findByText('Configure Options').should('not.exist')
      cy.findByText('Explore Options').should('exist')
      cy.findByText('File Explore Tool').should('exist')
    })

    it('does not render the tool options if there are not applicable tools for the file type', () => {
      cy.customMount(
        <ExternalToolsProvider externalToolsRepository={testExternalToolsRepository}>
          <FileExploreToolsOptions fileId={1} fileType="application/pdf" />
        </ExternalToolsProvider>
      )

      cy.findByText('Explore Options').should('not.exist')
      cy.findByText('Query Options').should('not.exist')
    })
  })

  describe('FileQueryToolsOptions', () => {
    it('renders the tool options if file query tools are available and compatible with the type', () => {
      cy.customMount(
        <ExternalToolsProvider externalToolsRepository={testExternalToolsRepository}>
          <FileQueryToolsOptions fileId={1} fileType="text/plain" />
        </ExternalToolsProvider>
      )

      cy.findByText('Explore Options').should('not.exist')
      cy.findByText('Configure Options').should('not.exist')
      cy.findByText('Query Options').should('exist')
      cy.findByText('File Query Tool').should('exist')
    })

    it('does not render the tool options if there are not applicable tools for the file type', () => {
      cy.customMount(
        <ExternalToolsProvider externalToolsRepository={testExternalToolsRepository}>
          <FileQueryToolsOptions fileId={1} fileType="application/pdf" />
        </ExternalToolsProvider>
      )

      cy.findByText('Explore Options').should('not.exist')
      cy.findByText('Query Options').should('not.exist')
    })
  })

  describe('FileConfigureToolsOptions', () => {
    it('renders the tool options if file configure tools are available and compatible with the type', () => {
      cy.customMount(
        <ExternalToolsProvider externalToolsRepository={testExternalToolsRepository}>
          <FileConfigureToolsOptions fileId={1} fileType="text/plain" />
        </ExternalToolsProvider>
      )

      cy.findByText('Explore Options').should('not.exist')
      cy.findByText('Query Options').should('not.exist')
      cy.findByText('Configure Options').should('exist')
      cy.findByText('File Configure Tool').should('exist')
    })

    it('does not render the tool options if there are not applicable tools for the file type', () => {
      cy.customMount(
        <ExternalToolsProvider externalToolsRepository={testExternalToolsRepository}>
          <FileConfigureToolsOptions fileId={1} fileType="application/pdf" />
        </ExternalToolsProvider>
      )

      cy.findByText('Explore Options').should('not.exist')
      cy.findByText('Query Options').should('not.exist')
    })
  })
})
