import { ExternalToolsRepository } from '@/externalTools/domain/repositories/ExternalToolsRepository'
import { FileEmbeddedExternalTool } from '@/sections/file/file-embedded-external-tool/FileEmbeddedExternalTool'
import { FilePageHelper } from '@/sections/file/FilePageHelper'
import { WriteError } from '@iqss/dataverse-client-javascript'
import { ExternalToolsMother } from '@tests/component/externalTools/domain/models/ExternalToolsMother'
import { FileExternalToolResolvedMother } from '@tests/component/externalTools/domain/models/FileExternalToolResolvedMother'
import { FileMother } from '@tests/component/files/domain/models/FileMother'
import { AccessRepository } from '@/access/domain/repositories/AccessRepository'
import { AccessRepositoryProvider } from '@/sections/access/AccessRepositoryProvider'
import { CustomTermsMother } from '@tests/component/dataset/domain/models/TermsOfUseMother'
import { FilePermissionsMother } from '@tests/component/files/domain/models/FilePermissionsMother'

const externalToolsRepository: ExternalToolsRepository = {} as ExternalToolsRepository // Used for fetching the tool resolved URL
const accessRepository: AccessRepository = {} as AccessRepository

const testFile = FileMother.createRealistic() // text/plain file
const filePreviewTool = ExternalToolsMother.createFilePreviewTool() // id: 2
const filePreviewToolResolved = FileExternalToolResolvedMother.create({
  displayName: 'File Preview Tool',
  toolUrlResolved: 'https://example.com/preview-tool?fileId=1'
})
const fileQueryTool = ExternalToolsMother.createFileQueryTool() // id: 4
const fileQueryToolResolved = FileExternalToolResolvedMother.create({
  displayName: 'File Query Tool',
  toolUrlResolved: 'https://example.com/query-tool?fileId=1'
})

describe('FileEmbeddedExternalTool', () => {
  it('renders a single preview tool', () => {
    externalToolsRepository.getFileExternalToolResolved = cy
      .stub()
      .resolves(filePreviewToolResolved)

    cy.customMount(
      <FileEmbeddedExternalTool
        file={testFile}
        isInView
        applicableTools={[filePreviewTool]}
        externalToolsRepository={externalToolsRepository}
        toolTypeSelectedQueryParam={undefined}
      />
    )

    cy.findByTestId('external-tool-iframe')
      .should('exist')
      .should('have.attr', 'src', filePreviewToolResolved.toolUrlResolved)

    // Just a small wait to cover the iframe onLoad event, there is a cypress package for this, but to avoid installing it, just a wait is fine.
    cy.wait(1_000)

    cy.findByRole('link', { name: 'Open in New Window' })
      .should('exist')
      .should(
        'have.attr',
        'href',
        FilePageHelper.replacePreviewParamInToolUrl(filePreviewToolResolved.toolUrlResolved, false)
      )
  })

  it('renders multiple tools and allows switching between them', () => {
    const getFileExternalToolResolvedStub = cy.stub()

    // Stub the calls to getFileExternalToolResolved for each tool
    getFileExternalToolResolvedStub
      .withArgs(testFile.id, filePreviewTool.id)
      .resolves(filePreviewToolResolved)

    getFileExternalToolResolvedStub
      .withArgs(testFile.id, fileQueryTool.id)
      .resolves(fileQueryToolResolved)

    externalToolsRepository.getFileExternalToolResolved = getFileExternalToolResolvedStub

    cy.customMount(
      <FileEmbeddedExternalTool
        file={testFile}
        isInView
        applicableTools={[filePreviewTool, fileQueryTool]}
        externalToolsRepository={externalToolsRepository}
        toolTypeSelectedQueryParam="preview"
      />
    )
    // The "Change Tool" button is present to select between the two tools
    cy.findByRole('button', { name: 'Change Tool' }).should('exist').as('changeToolButton')
    cy.get('@changeToolButton').click()
    cy.findByRole('button', { name: filePreviewTool.displayName }).should('exist')
    cy.findByRole('button', { name: fileQueryTool.displayName }).should('exist')
    cy.get('@changeToolButton').click() // Close the dropdown

    // Initially the preview tool is selected

    cy.findByTestId('external-tool-iframe')
      .should('exist')
      .should('have.attr', 'src', filePreviewToolResolved.toolUrlResolved)

    cy.findByRole('link', { name: 'Open in New Window' })
      .should('exist')
      .should(
        'have.attr',
        'href',
        FilePageHelper.replacePreviewParamInToolUrl(filePreviewToolResolved.toolUrlResolved, false)
      )

    // Now we select the query tool
    cy.get('@changeToolButton').click()
    cy.findByRole('button', { name: fileQueryTool.displayName }).click()

    cy.findByTestId('external-tool-iframe')
      .should('exist')
      .should('have.attr', 'src', fileQueryToolResolved.toolUrlResolved)

    cy.findByRole('link', { name: 'Open in New Window' })
      .should('exist')
      .should(
        'have.attr',
        'href',
        FilePageHelper.replacePreviewParamInToolUrl(fileQueryToolResolved.toolUrlResolved, false)
      )
  })

  it('does not load the iframe if tab wrapping the component is not in view', () => {
    externalToolsRepository.getFileExternalToolResolved = cy
      .stub()
      .resolves(filePreviewToolResolved)

    cy.customMount(
      <FileEmbeddedExternalTool
        file={testFile}
        isInView={false}
        applicableTools={[filePreviewTool]}
        externalToolsRepository={externalToolsRepository}
        toolTypeSelectedQueryParam={undefined}
      />
    )
    cy.findByTestId('external-tool-iframe').should('not.exist')
  })

  it('requires dataset terms acceptance before loading the external tool', () => {
    const fileWithCustomTerms = FileMother.createRealistic({
      permissions: FilePermissionsMother.create({
        canDownloadFile: true,
        canEditOwnerDataset: false,
        canManageFilePermissions: false
      }),
      datasetCustomTerms: CustomTermsMother.create({
        termsOfUse: 'Preview requires accepting these custom terms.'
      })
    })
    externalToolsRepository.getFileExternalToolResolved = cy
      .stub()
      .as('getFileExternalToolResolved')
      .resolves(filePreviewToolResolved)
    accessRepository.submitGuestbookForDatasetDownload = cy.stub().resolves('signed-url-dataset')
    accessRepository.submitGuestbookForDatafileDownload = cy
      .stub()
      .as('submitGuestbookForDatafileDownload')
      .resolves('signed-url-datafile')
    accessRepository.submitGuestbookForDatafilesDownload = cy
      .stub()
      .resolves('signed-url-datafiles')

    cy.customMount(
      <AccessRepositoryProvider repository={accessRepository}>
        <FileEmbeddedExternalTool
          file={fileWithCustomTerms}
          isInView
          applicableTools={[filePreviewTool]}
          externalToolsRepository={externalToolsRepository}
          toolTypeSelectedQueryParam={undefined}
        />
      </AccessRepositoryProvider>
    )

    cy.findByRole('dialog').should('exist')
    cy.findByText('Preview requires accepting these custom terms.').should('exist')
    cy.findByTestId('external-tool-iframe').should('not.exist')
    cy.get('@getFileExternalToolResolved').should('not.have.been.called')

    cy.findByRole('button', { name: 'Accept' }).click()

    cy.get('@submitGuestbookForDatafileDownload').should('have.been.calledOnce')
    cy.findByRole('dialog').should('not.exist')
    cy.findByTestId('external-tool-iframe')
      .should('exist')
      .should('have.attr', 'src', filePreviewToolResolved.toolUrlResolved)
  })

  describe('error handling', () => {
    it('shows js dataverse error message if fetching the tool URL fails with a JSDataverseError', () => {
      externalToolsRepository.getFileExternalToolResolved = cy
        .stub()
        .rejects(new WriteError('Some js dataverse processed error message.'))
      cy.customMount(
        <FileEmbeddedExternalTool
          file={testFile}
          isInView
          applicableTools={[filePreviewTool]}
          externalToolsRepository={externalToolsRepository}
          toolTypeSelectedQueryParam={undefined}
        />
      )

      cy.findByText(/Some js dataverse processed error message./)
      cy.findByTestId('external-tool-iframe').should('not.exist')
    })

    it('shows fallback error message if fetching the tool URL fails', () => {
      externalToolsRepository.getFileExternalToolResolved = cy
        .stub()
        .rejects(new Error('Failed to fetch tool URL'))

      cy.customMount(
        <FileEmbeddedExternalTool
          file={testFile}
          isInView
          applicableTools={[filePreviewTool]}
          externalToolsRepository={externalToolsRepository}
          toolTypeSelectedQueryParam={undefined}
        />
      )

      cy.findByText(/Something went wrong loading the external tool. Try again later./)
      cy.findByTestId('external-tool-iframe').should('not.exist')
    })
  })
})
