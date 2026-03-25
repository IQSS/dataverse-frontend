import {
  FileDownloadUrlsMother,
  FileTypeMother
} from '../../../../files/domain/models/FileMetadataMother'
import { FileNonTabularDownloadOptions } from '../../../../../../src/sections/file/file-action-buttons/access-file-menu/FileNonTabularDownloadOptions'
import { DatasetContext } from '@/sections/dataset/DatasetContext'
import { DatasetMother } from '@tests/component/dataset/domain/models/DatasetMother'
import { ReactNode, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
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
  const TranslationPreloader = ({ children }: { children: ReactNode }) => {
    useTranslation('files')
    useTranslation('dataset')
    useTranslation('guestbooks')

    return <>{children}</>
  }

  const withDataset = (component: React.ReactNode) => (
    <DatasetContext.Provider
      value={{
        dataset: DatasetMother.create({
          id: 123,
          persistentId: 'doi:10.5072/FK2/NONTABULARFILE',
          guestbookId: 10
        }),
        isLoading: false,
        refreshDataset: () => {}
      }}>
      {component}
    </DatasetContext.Provider>
  )

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
        type={textType}
        downloadUrlOriginal={downloadUrls.original}
        ingestIsInProgress={false}
        isLockedFromFileDownload
      />
    )

    cy.findByRole('button', { name: 'Plain Text' }).should('have.class', 'disabled')
  })

  it('opens the guestbook modal when original format is clicked', () => {
    cy.customMount(
      <Suspense fallback="loading">
        <TranslationPreloader>
          {withDataset(
            <FileNonTabularDownloadOptions
              fileId={defaultProps.fileId}
              guestbookId={10}
              datasetPersistentId="doi:10.5072/FK2/NONTABULARFILE"
              type={textType}
              downloadUrlOriginal={downloadUrls.original}
              ingestIsInProgress={false}
              isLockedFromFileDownload={defaultProps.isLockedFromFileDownload}
            />
          )}
        </TranslationPreloader>
      </Suspense>
    )

    cy.findByRole('button', { name: 'Plain Text' }).click()

    cy.findByRole('dialog').should('exist')
    cy.findByRole('button', { name: 'Accept' }).should('exist')
  })

  it('shows a success toast when direct download succeeds without guestbook', () => {
    cy.window().then((window) => {
      cy.stub(window.HTMLAnchorElement.prototype, 'click').as('anchorClick')
    })

    cy.customMount(
      withAccessRepository(
        <FileNonTabularDownloadOptions
          fileId={defaultProps.fileId}
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
