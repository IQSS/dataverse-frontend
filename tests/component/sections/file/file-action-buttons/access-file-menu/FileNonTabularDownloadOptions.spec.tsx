import {
  FileDownloadUrlsMother,
  FileTypeMother
} from '../../../../files/domain/models/FileMetadataMother'
import { FileNonTabularDownloadOptions } from '../../../../../../src/sections/file/file-action-buttons/access-file-menu/FileNonTabularDownloadOptions'
import { AccessRepository } from '@/access/domain/repositories/AccessRepository'
import { AccessRepositoryProvider } from '@/sections/access/AccessRepositoryProvider'

const unknownType = FileTypeMother.createUnknown()
const downloadUrls = FileDownloadUrlsMother.create()
const textType = FileTypeMother.createText()
const defaultProps = {
  fileId: 1,
  isLockedFromFileDownload: false
}

describe('FileNonTabularDownloadOptions', () => {
  const withAccessRepository = (
    component: React.ReactNode,
    repositoryOverrides: Partial<AccessRepository> = {}
  ) => {
    const accessRepository: AccessRepository = {
      submitGuestbookForDatasetDownload: cy.stub().resolves('signed-url-dataset'),
      submitGuestbookForDatafileDownload: cy.stub().resolves('signed-url-file'),
      submitGuestbookForDatafilesDownload: cy.stub().resolves('signed-url-datafiles'),
      ...repositoryOverrides
    }

    return (
      <AccessRepositoryProvider repository={accessRepository}>{component}</AccessRepositoryProvider>
    )
  }

  it('renders the download options for a file of unknown type', () => {
    cy.customMount(
      <FileNonTabularDownloadOptions
        fileId={defaultProps.fileId}
        hasGuestbook={false}
        onOpenGuestbookModal={cy.stub()}
        type={unknownType}
        downloadUrlOriginal={downloadUrls.original}
        ingestIsInProgress={false}
        isLockedFromFileDownload={defaultProps.isLockedFromFileDownload}
      />
    )

    cy.findByRole('button', { name: 'Original File Format' })
      .should('exist')
      .should('not.have.class', 'disabled')
  })

  it('renders the download options for a file of known type', () => {
    cy.customMount(
      <FileNonTabularDownloadOptions
        fileId={defaultProps.fileId}
        hasGuestbook={false}
        onOpenGuestbookModal={cy.stub()}
        type={textType}
        downloadUrlOriginal={downloadUrls.original}
        ingestIsInProgress={false}
        isLockedFromFileDownload={defaultProps.isLockedFromFileDownload}
      />
    )

    cy.findByRole('button', { name: 'Plain Text' })
      .should('exist')
      .should('not.have.class', 'disabled')
  })

  it('renders the options as disabled when the file ingest is in progress', () => {
    cy.customMount(
      <FileNonTabularDownloadOptions
        fileId={defaultProps.fileId}
        hasGuestbook={false}
        onOpenGuestbookModal={cy.stub()}
        type={textType}
        downloadUrlOriginal={downloadUrls.original}
        ingestIsInProgress
        isLockedFromFileDownload={defaultProps.isLockedFromFileDownload}
      />
    )

    cy.findByRole('button', { name: 'Plain Text' }).should('have.class', 'disabled')
  })

  it('renders the options as disabled when the dataset is locked from file download', () => {
    cy.customMount(
      <FileNonTabularDownloadOptions
        fileId={defaultProps.fileId}
        hasGuestbook={false}
        onOpenGuestbookModal={cy.stub()}
        type={textType}
        downloadUrlOriginal={downloadUrls.original}
        ingestIsInProgress={false}
        isLockedFromFileDownload
      />
    )

    cy.findByRole('button', { name: 'Plain Text' }).should('have.class', 'disabled')
  })

  it('requests opening the guestbook modal when original format is clicked', () => {
    const onOpenGuestbookModal = cy.stub().as('onOpenGuestbookModal')

    cy.customMount(
      <FileNonTabularDownloadOptions
        fileId={defaultProps.fileId}
        hasGuestbook
        onOpenGuestbookModal={onOpenGuestbookModal}
        type={textType}
        downloadUrlOriginal={downloadUrls.original}
        ingestIsInProgress={false}
        isLockedFromFileDownload={defaultProps.isLockedFromFileDownload}
      />
    )

    cy.findByRole('button', { name: 'Plain Text' }).click()

    cy.get('@onOpenGuestbookModal').should('have.been.calledOnce')
  })

  it('shows a success toast when direct download succeeds without guestbook', () => {
    cy.window().then((window) => {
      cy.stub(window.HTMLAnchorElement.prototype, 'click').as('anchorClick')
    })

    cy.customMount(
      withAccessRepository(
        <FileNonTabularDownloadOptions
          fileId={defaultProps.fileId}
          hasGuestbook={false}
          onOpenGuestbookModal={cy.stub()}
          type={textType}
          downloadUrlOriginal={downloadUrls.original}
          ingestIsInProgress={false}
          isLockedFromFileDownload={defaultProps.isLockedFromFileDownload}
        />
      )
    )

    cy.findByRole('button', { name: 'Plain Text' }).click()

    cy.get('@anchorClick').should('have.been.calledOnce')
    cy.findByText('Your download has started.').should('exist')
  })
})
