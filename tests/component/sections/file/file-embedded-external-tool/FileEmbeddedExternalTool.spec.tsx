import { ExternalToolsRepository } from '@/externalTools/domain/repositories/ExternalToolsRepository'
import { FileEmbeddedExternalTool } from '@/sections/file/file-embedded-external-tool/FileEmbeddedExternalTool'
import { FilePageHelper } from '@/sections/file/FilePageHelper'
import { ApiConfig, WriteError } from '@iqss/dataverse-client-javascript'
import { DataverseApiAuthMechanism } from '@iqss/dataverse-client-javascript/dist/core/infra/repositories/ApiConfig'
import { ComponentProps } from 'react'
import { ExternalToolsMother } from '@tests/component/externalTools/domain/models/ExternalToolsMother'
import { FileExternalToolResolvedMother } from '@tests/component/externalTools/domain/models/FileExternalToolResolvedMother'
import { FileMother } from '@tests/component/files/domain/models/FileMother'
import { FileMetadataMother } from '@tests/component/files/domain/models/FileMetadataMother'
import { DatasetVersionMother } from '@tests/component/dataset/domain/models/DatasetMother'
import type { DatasetVersion } from '@/dataset/domain/models/Dataset'
import { AccessRepository } from '@/access/domain/repositories/AccessRepository'
import { AccessRepositoryProvider } from '@/sections/access/AccessRepositoryProvider'
import { CustomTermsMother } from '@tests/component/dataset/domain/models/TermsOfUseMother'
import { FilePermissionsMother } from '@tests/component/files/domain/models/FilePermissionsMother'
import { ExternalToolsJSDataverseRepository } from '@/externalTools/infrastructure/repositories/ExternalToolsJSDataverseRepository'
import { GuestbookRepository } from '@/guestbooks/domain/repositories/GuestbookRepository'
import { WithRepositories } from '@tests/component/WithRepositories'

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

const FileEmbeddedExternalToolWithRepositories = (
  props: ComponentProps<typeof FileEmbeddedExternalTool>
) => (
  <WithRepositories externalToolsRepository={externalToolsRepository}>
    <FileEmbeddedExternalTool {...props} />
  </WithRepositories>
)

describe('FileEmbeddedExternalTool', () => {
  it('renders a single preview tool', () => {
    externalToolsRepository.getFileExternalToolResolved = cy
      .stub()
      .resolves(filePreviewToolResolved)

    cy.customMount(
      <FileEmbeddedExternalToolWithRepositories
        file={testFile}
        isInView
        applicableTools={[filePreviewTool]}
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
      <FileEmbeddedExternalToolWithRepositories
        file={testFile}
        isInView
        applicableTools={[filePreviewTool, fileQueryTool]}
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
      <FileEmbeddedExternalToolWithRepositories
        file={testFile}
        isInView={false}
        applicableTools={[filePreviewTool]}
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
        <FileEmbeddedExternalToolWithRepositories
          file={fileWithCustomTerms}
          isInView
          applicableTools={[filePreviewTool]}
          toolTypeSelectedQueryParam={undefined}
        />
      </AccessRepositoryProvider>
    )

    cy.findByRole('dialog').should('exist')
    cy.findByText('Preview requires accepting these custom terms.').should('exist')
    cy.findByTestId('external-tool-iframe').should('not.exist')
    cy.get('@getFileExternalToolResolved').should('not.have.been.called')

    cy.findByRole('button', { name: 'Accept' }).click()

    cy.get('@submitGuestbookForDatafileDownload').should('not.have.been.called')
    cy.findByRole('dialog').should('not.exist')
    cy.findByTestId('external-tool-iframe')
      .should('exist')
      .should('have.attr', 'src', filePreviewToolResolved.toolUrlResolved)
  })

  const verifyGuestbookToolLaunch = (datasetVersion: DatasetVersion) => {
    ApiConfig.init('/api/v1', DataverseApiAuthMechanism.SESSION_COOKIE)
    const file = FileMother.createRealistic({
      guestbookId: 10,
      datasetVersion,
      metadata: FileMetadataMother.createWithPublicationDate(),
      permissions: FilePermissionsMother.create({ canEditOwnerDataset: false })
    })
    const guestbookRepository = {
      getGuestbook: cy.stub().resolves({
        id: file.guestbookId,
        name: 'File guestbook',
        nameRequired: true,
        emailRequired: true,
        customQuestions: []
      })
    } as GuestbookRepository
    accessRepository.submitGuestbookForDatafileDownload = cy
      .stub()
      .as('submitGuestbookForDatafileDownload')
      .resolves('unused-signed-url')

    const previewUrl = '/preview-tool?preview=true'
    const newWindowUrl = '/preview-tool?preview=false'
    cy.intercept(
      'POST',
      `**/api/v1/files/${file.id}/externalTool/${filePreviewTool.id}/toolUrl`,
      (req) => {
        const { preview } = req.body as { preview: boolean }
        req.alias = preview ? 'getPreviewUrl' : 'getNewWindowUrl'
        req.reply({
          status: 'OK',
          data: {
            toolUrl: preview ? previewUrl : newWindowUrl,
            displayName: filePreviewTool.displayName,
            fileId: file.id,
            preview
          }
        })
      }
    )
    cy.intercept('GET', '**/preview-tool?preview=true', { body: '' })
    const newWindow = { closed: false, opener: null, location: { href: '' } }
    cy.window().then((win) => {
      cy.stub(win, 'open').returns(newWindow)
    })

    cy.customMount(
      <AccessRepositoryProvider repository={accessRepository}>
        <WithRepositories
          externalToolsRepository={new ExternalToolsJSDataverseRepository()}
          guestbookRepository={guestbookRepository}>
          <FileEmbeddedExternalTool
            file={file}
            isInView
            applicableTools={[filePreviewTool]}
            toolTypeSelectedQueryParam={undefined}
          />
        </WithRepositories>
      </AccessRepositoryProvider>
    )

    cy.findByLabelText(/^Name/).type('Test Reader')
    cy.findByLabelText(/^Email/).type('reader@example.com')
    cy.findByRole('button', { name: 'Accept' }).click()

    const guestbookResponse = { name: 'Test Reader', email: 'reader@example.com', answers: [] }
    cy.wait('@getPreviewUrl')
      .its('request.body')
      .should('deep.equal', { preview: true, locale: 'en', guestbookResponse })
    cy.findByTestId('external-tool-iframe').should('have.attr', 'src', previewUrl)

    cy.findByRole('button', { name: 'Open in New Window' }).click()
    cy.wait('@getNewWindowUrl')
      .its('request.body')
      .should('deep.equal', { preview: false, locale: 'en', guestbookResponse })
    cy.wrap(newWindow).its('location.href').should('equal', newWindowUrl)
    cy.get('@submitGuestbookForDatafileDownload').should('not.have.been.called')
  }

  it('sends the guestbook response for preview and a new window from a published version', () => {
    verifyGuestbookToolLaunch(DatasetVersionMother.createRealistic())
  })

  it('sends the guestbook response for an already-published file from a draft version', () => {
    verifyGuestbookToolLaunch(
      DatasetVersionMother.createDraftAsLatestVersionWithSomeVersionHasBeenReleased()
    )
  })

  it('launches both tool views for a dataset editor with no guestbook form', () => {
    const file = FileMother.createRealistic({
      guestbookId: 10,
      datasetVersion:
        DatasetVersionMother.createDraftAsLatestVersionWithSomeVersionHasBeenReleased(),
      metadata: FileMetadataMother.createWithPublicationDate(),
      permissions: FilePermissionsMother.create({ canEditOwnerDataset: true })
    })
    const resolveTool = cy.stub()
    resolveTool.onFirstCall().resolves(filePreviewToolResolved)
    resolveTool.onSecondCall().resolves(fileQueryToolResolved)
    externalToolsRepository.getFileExternalToolResolved = resolveTool

    const newWindow = { closed: false, opener: null, location: { href: '' } }
    cy.window().then((win) => {
      cy.stub(win, 'open').returns(newWindow)
    })

    cy.customMount(
      <FileEmbeddedExternalToolWithRepositories
        file={file}
        isInView
        applicableTools={[filePreviewTool]}
        toolTypeSelectedQueryParam={undefined}
      />
    )

    cy.findByTestId('external-tool-iframe').should(
      'have.attr',
      'src',
      filePreviewToolResolved.toolUrlResolved
    )
    cy.findByRole('dialog').should('not.exist')
    cy.wrap(resolveTool).should('have.been.calledWithExactly', file.id, filePreviewTool.id, {
      preview: true,
      locale: 'en',
      guestbookResponse: {}
    })

    cy.findByRole('button', { name: 'Open in New Window' }).click()
    cy.wrap(resolveTool).should('have.been.calledWithExactly', file.id, filePreviewTool.id, {
      preview: false,
      locale: 'en',
      guestbookResponse: {}
    })
    cy.wrap(newWindow).its('location.href').should('equal', fileQueryToolResolved.toolUrlResolved)
  })

  it('loads a newly uploaded draft file before the guestbook is required', () => {
    const file = FileMother.createRealistic({
      guestbookId: 10,
      datasetVersion:
        DatasetVersionMother.createDraftAsLatestVersionWithSomeVersionHasBeenReleased(),
      metadata: FileMetadataMother.createWithNoPublicationDate()
    })
    externalToolsRepository.getFileExternalToolResolved = cy
      .stub()
      .as('getFileExternalToolResolved')
      .resolves(filePreviewToolResolved)

    cy.customMount(
      <FileEmbeddedExternalToolWithRepositories
        file={file}
        isInView
        applicableTools={[filePreviewTool]}
        toolTypeSelectedQueryParam={undefined}
      />
    )

    cy.findByTestId('external-tool-iframe').should(
      'have.attr',
      'src',
      filePreviewToolResolved.toolUrlResolved
    )
    cy.findByRole('dialog').should('not.exist')
    cy.get('@getFileExternalToolResolved').should(
      'have.been.calledWithExactly',
      file.id,
      filePreviewTool.id,
      {
        preview: true,
        locale: 'en'
      }
    )
  })

  it('allows reopening the terms dialog after canceling it', () => {
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
        <FileEmbeddedExternalToolWithRepositories
          file={fileWithCustomTerms}
          isInView
          applicableTools={[filePreviewTool]}
          toolTypeSelectedQueryParam={undefined}
        />
      </AccessRepositoryProvider>
    )

    cy.findByRole('dialog').should('exist')
    cy.findByRole('button', { name: 'Cancel' }).click()

    cy.findByRole('dialog').should('not.exist')
    cy.findByRole('button', { name: 'Accept the dataset terms or guestbooks' }).should('exist')
    cy.findByText('before previewing this file.').should('exist')
    cy.findByRole('button', { name: 'Accept the dataset terms or guestbooks' }).click()

    cy.findByRole('dialog').should('exist')
    cy.findByText('Preview requires accepting these custom terms.').should('exist')
    cy.get('@getFileExternalToolResolved').should('not.have.been.called')
    cy.findByTestId('external-tool-iframe').should('not.exist')
  })

  describe('error handling', () => {
    it('shows js dataverse error message if fetching the tool URL fails with a JSDataverseError', () => {
      externalToolsRepository.getFileExternalToolResolved = cy
        .stub()
        .rejects(new WriteError('Some js dataverse processed error message.'))
      cy.customMount(
        <FileEmbeddedExternalToolWithRepositories
          file={testFile}
          isInView
          applicableTools={[filePreviewTool]}
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
        <FileEmbeddedExternalToolWithRepositories
          file={testFile}
          isInView
          applicableTools={[filePreviewTool]}
          toolTypeSelectedQueryParam={undefined}
        />
      )

      cy.findByText(/Something went wrong loading the external tool. Try again later./)
      cy.findByTestId('external-tool-iframe').should('not.exist')
    })
  })
})
