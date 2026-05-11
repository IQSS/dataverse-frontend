import { FileRepository } from '../../../../src/files/domain/repositories/FileRepository'
import { FileMother } from '../../files/domain/models/FileMother'
import { File } from '../../../../src/sections/file/File'
import { DatasetMockRepository } from '@/stories/dataset/DatasetMockRepository'
import { ExternalToolsRepository } from '@/externalTools/domain/repositories/ExternalToolsRepository'
import { ExternalToolsProvider } from '@/shared/contexts/external-tools/ExternalToolsProvider'
import { ExternalToolsMother } from '@tests/component/externalTools/domain/models/ExternalToolsMother'
import { FileExternalToolResolvedMother } from '@tests/component/externalTools/domain/models/FileExternalToolResolvedMother'
import { DataverseInfoMockRepository } from '@/stories/shared-mock-repositories/info/DataverseInfoMockRepository'
import { ContactMockRepository } from '@/stories/shared-mock-repositories/contact/ContactMockRepository'
import { DatasetVersionMother } from '@tests/component/dataset/domain/models/DatasetMother'

const fileRepository: FileRepository = {} as FileRepository

describe('File', () => {
  it('renders the File page title and details', () => {
    const testFile = FileMother.createRealistic()
    fileRepository.getById = cy.stub().resolves(testFile)

    cy.customMount(
      <File
        repository={fileRepository}
        id={19}
        datasetRepository={new DatasetMockRepository()}
        dataverseInfoRepository={new DataverseInfoMockRepository()}
        contactRepository={new ContactMockRepository()}
      />
    )

    cy.wrap(fileRepository.getById).should('be.calledWith', 19)

    cy.findByRole('link', { name: 'Dataset Title' }).should('exist')
    cy.findByRole('link', { name: 'Root' }).should('exist')
    cy.findAllByText(testFile.name).should('exist')
    cy.findByText(`This file is part of "${testFile.datasetVersion.title}".`).should('exist')
    cy.findByText('File Citation').should('exist')
    cy.findByText(/fileName/).should('exist')
    cy.findByText('Dataset Citation').should('exist')
    cy.findByText('Cite Dataset').should('exist')
    cy.findAllByText(/Bennet, Elizabeth; Darcy, Fitzwilliam, 2023, "Dataset Title",/).should(
      'exist'
    )
    cy.findByText('Version 1.0').should('exist')
    cy.findByRole('tab', { name: 'Metadata' }).should('exist')
    cy.findByRole('tab', { name: 'Versions' }).should('exist')
    cy.findByRole('button', { name: 'File Metadata' }).should('exist')
    cy.findByRole('group', { name: 'File Action Buttons' }).should('exist')
  })

  it('renders skeleton while loading', () => {
    const testFile = FileMother.createRealistic()
    fileRepository.getById = cy.stub().resolves(testFile)

    cy.customMount(
      <File
        repository={fileRepository}
        id={19}
        datasetRepository={new DatasetMockRepository()}
        dataverseInfoRepository={new DataverseInfoMockRepository()}
        contactRepository={new ContactMockRepository()}
      />
    )

    cy.findByTestId('file-skeleton').should('exist')
    cy.wrap(fileRepository.getById).should('be.calledWith', 19)
    cy.findAllByText(testFile.name).should('exist')
  })

  it('renders page not found when file is not found', () => {
    fileRepository.getById = cy.stub().resolves(undefined)

    cy.customMount(
      <File
        repository={fileRepository}
        id={19}
        datasetRepository={new DatasetMockRepository()}
        dataverseInfoRepository={new DataverseInfoMockRepository()}
        contactRepository={new ContactMockRepository()}
      />
    )

    cy.findByTestId('not-found-page').should('exist')
  })

  it('renders the restricted icon if the file is restricted', () => {
    const testFile = FileMother.createRestricted()
    fileRepository.getById = cy.stub().resolves(testFile)

    cy.customMount(
      <File
        repository={fileRepository}
        id={19}
        datasetRepository={new DatasetMockRepository()}
        dataverseInfoRepository={new DataverseInfoMockRepository()}
        contactRepository={new ContactMockRepository()}
      />
    )

    cy.findByText('Restricted File Icon').should('exist')
  })

  it('renders the FileVersions component', () => {
    const testFile = FileMother.createRealistic()
    const summaries = FileMother.createFileVersionSummary()
    fileRepository.getById = cy.stub().resolves(testFile)
    fileRepository.getFileVersionSummaries = cy
      .stub()
      .resolves({ summaries, totalCount: summaries.length })

    cy.customMount(
      <File
        repository={fileRepository}
        id={19}
        datasetVersionNumber={'2.0'}
        datasetRepository={new DatasetMockRepository()}
        dataverseInfoRepository={new DataverseInfoMockRepository()}
        contactRepository={new ContactMockRepository()}
      />
    )

    cy.findByText('Version 1.0').should('exist')
    cy.findByRole('tab', { name: 'Metadata' }).should('exist')
    cy.findByRole('tab', { name: 'Versions' }).should('exist').click()

    cy.contains('Version').should('exist')
    cy.contains('Summary').should('exist')
    cy.contains('Contributors').should('exist')
    cy.contains('Published On').should('exist')
  })

  it('should not render Share button if the the file dataset version is deaccessioned', () => {
    const testFile = FileMother.createRealistic({
      datasetVersion: DatasetVersionMother.createDeaccessioned()
    })
    fileRepository.getById = cy.stub().as('getFile').resolves(testFile)

    cy.customMount(
      <File
        repository={fileRepository}
        id={19}
        datasetVersionNumber={'2.0'}
        datasetRepository={new DatasetMockRepository()}
        dataverseInfoRepository={new DataverseInfoMockRepository()}
        contactRepository={new ContactMockRepository()}
      />
    )
    cy.findByText('Deaccessioned').should('exist')
    cy.findByRole('button', { name: 'Share' }).should('not.exist')
  })

  describe('external tools tab', () => {
    const externalToolsRepository: ExternalToolsRepository = {} as ExternalToolsRepository

    beforeEach(() => {
      const testFile = FileMother.createRealistic()
      fileRepository.getById = cy.stub().resolves(testFile)
      externalToolsRepository.getExternalTools = cy
        .stub()
        .resolves([ExternalToolsMother.createFilePreviewTool()])
      externalToolsRepository.getFileExternalToolResolved = cy
        .stub()
        .resolves(FileExternalToolResolvedMother.create())
    })

    it('renders the External Tools tab with "Preview" title if only one tool applicable and is a preview tool', () => {
      cy.customMount(
        <ExternalToolsProvider externalToolsRepository={externalToolsRepository}>
          <File
            repository={fileRepository}
            id={19}
            datasetRepository={new DatasetMockRepository()}
            dataverseInfoRepository={new DataverseInfoMockRepository()}
            contactRepository={new ContactMockRepository()}
          />
        </ExternalToolsProvider>
      )

      cy.findByRole('tab', { name: 'Preview' }).should('exist')
    })

    it('renders the External Tools tab with "Query" title if only one tool applicable and is an query tool', () => {
      externalToolsRepository.getExternalTools = cy
        .stub()
        .resolves([ExternalToolsMother.createFileQueryTool()])

      cy.customMount(
        <ExternalToolsProvider externalToolsRepository={externalToolsRepository}>
          <File
            repository={fileRepository}
            id={19}
            datasetRepository={new DatasetMockRepository()}
            dataverseInfoRepository={new DataverseInfoMockRepository()}
            contactRepository={new ContactMockRepository()}
          />
        </ExternalToolsProvider>
      )

      cy.findByRole('tab', { name: 'Query' }).should('exist')
    })

    it('renders the External Tools tab with "File Tools" title if more than one applicable tool', () => {
      externalToolsRepository.getExternalTools = cy
        .stub()
        .resolves([
          ExternalToolsMother.createFilePreviewTool(),
          ExternalToolsMother.createFileQueryTool()
        ])

      cy.customMount(
        <ExternalToolsProvider externalToolsRepository={externalToolsRepository}>
          <File
            repository={fileRepository}
            id={19}
            datasetRepository={new DatasetMockRepository()}
            dataverseInfoRepository={new DataverseInfoMockRepository()}
            contactRepository={new ContactMockRepository()}
          />
        </ExternalToolsProvider>
      )

      cy.findByRole('tab', { name: 'File Tools' }).should('exist')
    })

    it('does not render the External Tools tab if no applicable tools', () => {
      externalToolsRepository.getExternalTools = cy.stub().resolves([])

      cy.customMount(
        <ExternalToolsProvider externalToolsRepository={externalToolsRepository}>
          <File
            repository={fileRepository}
            id={19}
            datasetRepository={new DatasetMockRepository()}
            dataverseInfoRepository={new DataverseInfoMockRepository()}
            contactRepository={new ContactMockRepository()}
          />
        </ExternalToolsProvider>
      )

      cy.findByRole('tab', { name: 'File Tools' }).should('not.exist')
      cy.findByRole('tab', { name: 'Preview' }).should('not.exist')
      cy.findByRole('tab', { name: 'Query' }).should('not.exist')
    })

    it('does not render the External Tools tab if applicable tool but user lacks download permission', () => {
      const testFile = FileMother.createWithDownloadPermissionDenied()
      fileRepository.getById = cy.stub().resolves(testFile)

      cy.customMount(
        <ExternalToolsProvider externalToolsRepository={externalToolsRepository}>
          <File
            repository={fileRepository}
            id={19}
            datasetRepository={new DatasetMockRepository()}
            dataverseInfoRepository={new DataverseInfoMockRepository()}
            contactRepository={new ContactMockRepository()}
          />
        </ExternalToolsProvider>
      )

      cy.findByRole('tab', { name: 'File Tools' }).should('not.exist')
      cy.findByRole('tab', { name: 'Preview' }).should('not.exist')
      cy.findByRole('tab', { name: 'Query' }).should('not.exist')
    })
  })
})
