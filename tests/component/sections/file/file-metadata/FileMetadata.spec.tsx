import { FileMetadata } from '../../../../../src/sections/file/file-metadata/FileMetadata'
import { FileMother } from '../../../files/domain/models/FileMother'
import { FileLabelType } from '../../../../../src/files/domain/models/FilePreview'
import {
  FileEmbargoMother,
  FileTabularDataMother
} from '../../../files/domain/models/FilePreviewMother'
import { DateHelper } from '../../../../../src/shared/domain/helpers/DateHelper'

describe('FileMetadata', () => {
  it('renders the File Metadata tab', () => {
    cy.customMount(<FileMetadata file={FileMother.create()} />)

    cy.findByRole('button', { name: 'File Metadata' }).should('exist')
  })

  it('renders the file preview', () => {
    cy.customMount(<FileMetadata file={FileMother.create()} />)

    cy.findByText('Preview').should('exist')
    cy.findByRole('img').should('exist')
  })

  it('renders the file labels', () => {
    const labels = [
      { value: 'Category 1', type: FileLabelType.CATEGORY },
      { value: 'Tag 1', type: FileLabelType.TAG },
      { value: 'Tag 2', type: FileLabelType.TAG }
    ]
    cy.customMount(<FileMetadata file={FileMother.create({ labels: labels })} />)

    cy.findByText('File Tags').should('exist')
    cy.findByText('Category 1').should('have.class', 'bg-secondary')
    cy.findAllByText(/Tag/).should('have.class', 'bg-info')
  })

  it('does not render the file labels when there are no labels', () => {
    cy.customMount(<FileMetadata file={FileMother.create({ labels: [] })} />)

    cy.findByText('File Tags').should('not.exist')
  })

  it('renders the file persistent id', () => {
    cy.customMount(
      <FileMetadata file={FileMother.create({ persistentId: 'doi:10.5072/FK2/ABC123' })} />
    )

    cy.findByText('File Persistent ID').should('exist')
    cy.findByText('doi:10.5072/FK2/ABC123').should('exist')
  })

  it('does not render the file persistent id when there is no persistent id', () => {
    cy.customMount(<FileMetadata file={FileMother.create({ persistentId: undefined })} />)

    cy.findByText('File Persistent ID').should('not.exist')
  })

  it('renders the download url if the user has file download permissions', () => {
    cy.customMount(
      <FileMetadata
        file={FileMother.createWithDownloadPermissionGranted({
          downloadUrls: { original: '/api/access/datafile/123' }
        })}
      />
    )

    cy.findByText('Download URL').should('exist')
    cy.findByText('/api/access/datafile/123', { exact: false }).should('exist')
    cy.findByText(
      'Use the Download URL in a Wget command or a download manager to avoid interrupted downloads, time outs or other failures.'
    ).should('exist')
    cy.findByRole('link', { name: 'User Guide - Downloading via URL' }).should(
      'have.attr',
      'href',
      'https://guides.dataverse.org/en/6.1/user/find-use-data.html#downloading-via-url'
    )
  })

  it('does not render the download url if the user does not have file download permissions', () => {
    cy.customMount(
      <FileMetadata
        file={FileMother.createWithDownloadPermissionDenied({
          downloadUrls: { original: '/api/access/datafile/123' }
        })}
      />
    )

    cy.findByText('Download URL').should('not.exist')
  })

  it('renders the file unf if it exists', () => {
    cy.customMount(
      <FileMetadata
        file={FileMother.create({ tabularData: FileTabularDataMother.create({ unf: 'some-unf' }) })}
      />
    )

    cy.findByText('File UNF').should('exist')
    cy.findByText('some-unf').should('exist')
  })

  it('does not render the file unf if it does not exist', () => {
    cy.customMount(<FileMetadata file={FileMother.create({ tabularData: undefined })} />)

    cy.findByText('File UNF').should('not.exist')
  })

  it('renders the file checksum', () => {
    cy.customMount(
      <FileMetadata
        file={FileMother.create({
          checksum: { algorithm: 'SHA-1', value: 'some-checksum' }
        })}
      />
    )

    cy.findByText('SHA-1').should('exist')
    cy.findByText('some-checksum').should('exist')
  })

  it('does not render the file checksum if it does not exist', () => {
    cy.customMount(<FileMetadata file={FileMother.create({ checksum: undefined })} />)

    cy.findByText('SHA-1').should('not.exist')
  })

  it('renders the file deposit date', () => {
    const date = new Date('2021-01-01')
    cy.customMount(
      <FileMetadata
        file={FileMother.create({
          depositDate: date
        })}
      />
    )

    cy.findByText('Deposit Date').should('exist')
    cy.findByText(DateHelper.toDisplayFormatYYYYMMDD(date)).should('exist')
  })

  it('renders the file Metadata Release Date', () => {
    const date = new Date('2021-01-01')
    cy.customMount(
      <FileMetadata
        file={FileMother.create({
          publicationDate: date
        })}
      />
    )

    cy.findByText('Metadata Release Date').should('exist')
    cy.findAllByText(DateHelper.toDisplayFormatYYYYMMDD(date)).should('exist')
  })

  it('does not render the file Metadata Release Date if the publication date does not exist', () => {
    cy.customMount(<FileMetadata file={FileMother.create({ publicationDate: undefined })} />)

    cy.findByText('Metadata Release Date').should('not.exist')
  })

  it('renders the file Publication Date', () => {
    const date = new Date('2021-10-01')
    cy.customMount(
      <FileMetadata
        file={FileMother.create({
          embargo: undefined,
          publicationDate: date
        })}
      />
    )

    cy.findByText('Publication Date').should('exist')
    cy.findAllByText(DateHelper.toDisplayFormatYYYYMMDD(date)).should('exist')
  })

  it('renders the file Publication Date with embargo', () => {
    const date = new Date('2021-05-01')
    cy.customMount(
      <FileMetadata
        file={FileMother.create({
          publicationDate: date,
          embargo: FileEmbargoMother.create({ dateAvailable: date })
        })}
      />
    )

    cy.findByText('Publication Date').should('exist')
    cy.findByText(DateHelper.toDisplayFormatYYYYMMDD(date)).should('exist')
  })

  it('does not render the file Publication Date if the publication date and embargo do not exist', () => {
    cy.customMount(
      <FileMetadata file={FileMother.create({ publicationDate: undefined, embargo: undefined })} />
    )

    cy.findByText('Publication Date').should('not.exist')
  })

  it('renders the file Embargo Reason', () => {
    cy.customMount(
      <FileMetadata
        file={FileMother.create({
          embargo: FileEmbargoMother.create({ reason: 'Some reason' })
        })}
      />
    )

    cy.findByText('Embargo Reason').should('exist')
    cy.findByText('Some reason').should('exist')
  })

  it('does not render the file Embargo Reason if the embargo does not exist', () => {
    cy.customMount(<FileMetadata file={FileMother.create({ embargo: undefined })} />)

    cy.findByText('Embargo Reason').should('not.exist')
  })

  it('does not render the file Embargo Reason if the embargo reason does not exist', () => {
    cy.customMount(
      <FileMetadata
        file={FileMother.create({
          embargo: FileEmbargoMother.createWithNoReason({ reason: undefined })
        })}
      />
    )

    cy.findByText('Embargo Reason').should('not.exist')
  })
})
