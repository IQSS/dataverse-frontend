import {
  FileDownloadUrlsMother,
  FileTypeMother
} from '../../../../files/domain/models/FileMetadataMother'
import { FileTabularDownloadOptions } from '../../../../../../src/sections/file/file-action-buttons/access-file-menu/FileTabularDownloadOptions'
import { DatasetContext } from '@/sections/dataset/DatasetContext'
import { DatasetMother } from '@tests/component/dataset/domain/models/DatasetMother'
import { ReactNode, Suspense } from 'react'
import { useTranslation } from 'react-i18next'

const tabularType = FileTypeMother.createTabular()
const downloadUrls = FileDownloadUrlsMother.create()
const defaultProps = {
  fileId: 1,
  isLockedFromFileDownload: false
}

describe('FileTabularDownloadOptions', () => {
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
          persistentId: 'doi:10.5072/FK2/TABULARFILE',
          guestbookId: 10
        }),
        isLoading: false,
        refreshDataset: () => {}
      }}>
      {component}
    </DatasetContext.Provider>
  )

  it('renders the download options for a tabular file', () => {
    cy.customMount(
      <FileTabularDownloadOptions
        fileId={defaultProps.fileId}
        type={tabularType}
        downloadUrls={downloadUrls}
        ingestInProgress={false}
        isLockedFromFileDownload={defaultProps.isLockedFromFileDownload}
      />
    )

    cy.findByRole('button', { name: 'Comma Separated Values (Original File Format)' }).should(
      'exist'
    )
    cy.findByRole('button', { name: 'Tab-Delimited' })
      .should('exist')
      .should('not.have.class', 'disabled')
  })

  it('renders the download options for a tabular file of unknown original type', () => {
    const unknownType = FileTypeMother.createTabularUnknown()
    cy.customMount(
      <FileTabularDownloadOptions
        fileId={defaultProps.fileId}
        type={unknownType}
        downloadUrls={downloadUrls}
        ingestInProgress={false}
        isLockedFromFileDownload={defaultProps.isLockedFromFileDownload}
      />
    )

    cy.findByRole('button', { name: /(Original File Format)/ }).should('not.exist')
    cy.findByRole('button', { name: 'Tab-Delimited' })
      .should('exist')
      .should('not.have.class', 'disabled')
    cy.findByRole('button', { name: 'R Data' }).should('exist').should('not.have.class', 'disabled')
  })

  it('renders the options as disabled when the file ingest is in progress', () => {
    cy.customMount(
      <FileTabularDownloadOptions
        fileId={defaultProps.fileId}
        type={tabularType}
        downloadUrls={downloadUrls}
        ingestInProgress
        isLockedFromFileDownload={defaultProps.isLockedFromFileDownload}
      />
    )

    cy.findByRole('button', { name: 'Comma Separated Values (Original File Format)' })
      .should('exist')
      .should('have.class', 'disabled')
    cy.findByRole('button', { name: 'Tab-Delimited' })
      .should('exist')
      .should('have.class', 'disabled')
    cy.findByRole('button', { name: 'R Data' }).should('exist').should('have.class', 'disabled')
  })

  it('renders the options as disabled when the dataset is locked from file download', () => {
    cy.customMount(
      <FileTabularDownloadOptions
        fileId={defaultProps.fileId}
        type={tabularType}
        downloadUrls={downloadUrls}
        ingestInProgress={false}
        isLockedFromFileDownload
      />
    )

    cy.findByRole('button', { name: 'Comma Separated Values (Original File Format)' })
      .should('exist')
      .should('have.class', 'disabled')
    cy.findByRole('button', { name: 'Tab-Delimited' })
      .should('exist')
      .should('have.class', 'disabled')
    cy.findByRole('button', { name: 'R Data' }).should('exist').should('have.class', 'disabled')
  })

  it('does not render the RData option if the file type is already R Data', () => {
    const rDataType = FileTypeMother.createRData()
    cy.customMount(
      <FileTabularDownloadOptions
        fileId={defaultProps.fileId}
        type={rDataType}
        downloadUrls={downloadUrls}
        ingestInProgress={false}
        isLockedFromFileDownload={defaultProps.isLockedFromFileDownload}
      />
    )

    cy.findByRole('button', { name: 'R Data (Original File Format)' })
      .should('exist')
      .should('not.have.class', 'disabled')
    cy.findByRole('button', { name: 'Tab-Delimited' })
      .should('exist')
      .should('not.have.class', 'disabled')
    cy.findByRole('button', { name: 'R Data' }).should('not.exist')
  })

  it('opens the guestbook modal when original format is clicked', () => {
    cy.customMount(
      <Suspense fallback="loading">
        <TranslationPreloader>
          {withDataset(
            <FileTabularDownloadOptions
              fileId={defaultProps.fileId}
              type={tabularType}
              downloadUrls={downloadUrls}
              ingestInProgress={false}
              guestbookId={10}
              datasetPersistentId="doi:10.5072/FK2/TABULARFILE"
              isLockedFromFileDownload={defaultProps.isLockedFromFileDownload}
            />
          )}
        </TranslationPreloader>
      </Suspense>
    )

    cy.findByRole('button', { name: 'Comma Separated Values (Original File Format)' }).click()

    cy.findByRole('dialog').should('exist')
    cy.findByRole('button', { name: 'Accept' }).should('exist')
  })

  it('opens the guestbook modal when tab-delimited format is clicked', () => {
    cy.customMount(
      <Suspense fallback="loading">
        <TranslationPreloader>
          {withDataset(
            <FileTabularDownloadOptions
              fileId={defaultProps.fileId}
              type={tabularType}
              downloadUrls={downloadUrls}
              ingestInProgress={false}
              guestbookId={10}
              datasetPersistentId="doi:10.5072/FK2/TABULARFILE"
              isLockedFromFileDownload={defaultProps.isLockedFromFileDownload}
            />
          )}
        </TranslationPreloader>
      </Suspense>
    )

    cy.findByRole('button', { name: 'Tab-Delimited' }).click()

    cy.findByRole('dialog').should('exist')
    cy.findByRole('button', { name: 'Accept' }).should('exist')
  })
})
