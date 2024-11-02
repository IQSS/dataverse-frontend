import { FileMetadata } from '../../../../../src/sections/file/file-metadata/FileMetadata'
import { FileMother } from '../../../files/domain/models/FileMother'
import { BASE_URL } from '../../../../../src/config'
import { FileSizeUnit } from '../../../../../src/files/domain/models/FileMetadata'
import {
  FileEmbargoMother,
  FileMetadataMother,
  FileSizeMother,
  FileTabularDataMother,
  FileTypeMother
} from '../../../files/domain/models/FileMetadataMother'
import { DatasetPublishingStatus } from '../../../../../src/dataset/domain/models/Dataset'
import { FilePermissionsMother } from '../../../files/domain/models/FilePermissionsMother'
import { DateHelper } from '../../../../../src/shared/helpers/DateHelper'

const file = FileMother.create()
describe('FileMetadata', () => {
  it('renders the File Metadata tab', () => {
    cy.customMount(
      <FileMetadata
        name={file.name}
        metadata={file.metadata}
        permissions={file.permissions}
        datasetPublishingStatus={file.datasetVersion.publishingStatus}
      />
    )

    cy.findByRole('button', { name: 'File Metadata' }).should('exist')
  })

  it('renders the file preview', () => {
    cy.customMount(
      <FileMetadata
        name={file.name}
        metadata={file.metadata}
        permissions={file.permissions}
        datasetPublishingStatus={file.datasetVersion.publishingStatus}
      />
    )

    cy.findByText('Preview').should('exist')
    cy.findByRole('img').should('exist')
  })

  it('renders the file labels', () => {
    const metadataWithLabels = FileMetadataMother.createWithLabelsRealistic()
    cy.customMount(
      <FileMetadata
        name={file.name}
        metadata={metadataWithLabels}
        permissions={file.permissions}
        datasetPublishingStatus={file.datasetVersion.publishingStatus}
      />
    )

    cy.findByText('File Tags').should('exist')
    cy.findByText('Category 1').should('have.class', 'bg-secondary')
    cy.findAllByText(/Tag/).should('have.class', 'bg-info')
  })

  it('does not render the file labels when there are no labels', () => {
    const metadataWithoutLabels = FileMetadataMother.createWithNoLabels()
    cy.customMount(
      <FileMetadata
        name={file.name}
        metadata={metadataWithoutLabels}
        permissions={file.permissions}
        datasetPublishingStatus={file.datasetVersion.publishingStatus}
      />
    )

    cy.findByText('File Tags').should('not.exist')
  })

  it('renders the file persistent id', () => {
    const metadataWithPersistentId = FileMetadataMother.create({
      persistentId: 'doi:10.5072/FK2/ABC123'
    })
    cy.customMount(
      <FileMetadata
        name={file.name}
        metadata={metadataWithPersistentId}
        permissions={file.permissions}
        datasetPublishingStatus={file.datasetVersion.publishingStatus}
      />
    )

    cy.findByText('File Persistent ID').should('exist')
    cy.findByText('doi:10.5072/FK2/ABC123').should('exist')
  })

  it('does not render the file persistent id when there is no persistent id', () => {
    const metadataWithoutPersistentId = FileMetadataMother.createWithNoPersistentId()
    cy.customMount(
      <FileMetadata
        name={file.name}
        metadata={metadataWithoutPersistentId}
        permissions={file.permissions}
        datasetPublishingStatus={file.datasetVersion.publishingStatus}
      />
    )

    cy.findByText('File Persistent ID').should('not.exist')
  })

  it('renders the download url if the user has file download permissions', () => {
    cy.viewport(1200, 900)
    const permissions = FilePermissionsMother.createWithDownloadFileGranted()

    file.metadata.downloadUrls.original = '/api/datafile/3?format=original'
    cy.customMount(
      <FileMetadata
        name={file.name}
        metadata={file.metadata}
        permissions={permissions}
        datasetPublishingStatus={file.datasetVersion.publishingStatus}
      />
    )

    cy.findByText('Download URL').should('exist')
    cy.findByText(`${BASE_URL}/api/datafile/3`).should('exist')
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
    const permissions = FilePermissionsMother.createWithDownloadFileDenied()
    cy.customMount(
      <FileMetadata
        name={file.name}
        metadata={file.metadata}
        permissions={permissions}
        datasetPublishingStatus={file.datasetVersion.publishingStatus}
      />
    )

    cy.findByText('Download URL').should('not.exist')
  })

  it('renders the file unf if it exists', () => {
    const metadataWithUnf = FileMetadataMother.create({
      tabularData: FileTabularDataMother.create({ unf: 'some-unf' })
    })
    cy.customMount(
      <FileMetadata
        name={file.name}
        metadata={metadataWithUnf}
        permissions={file.permissions}
        datasetPublishingStatus={file.datasetVersion.publishingStatus}
      />
    )

    cy.findByText('File UNF').should('exist')
    cy.findByText('some-unf').should('exist')
  })

  it('does not render the file unf if it does not exist', () => {
    const metadataWithoutTabularData = FileMetadataMother.createNonTabular()
    cy.customMount(
      <FileMetadata
        name={file.name}
        metadata={metadataWithoutTabularData}
        permissions={file.permissions}
        datasetPublishingStatus={file.datasetVersion.publishingStatus}
      />
    )

    cy.findByText('File UNF').should('not.exist')
  })

  it('renders the file checksum', () => {
    const metadataWithChecksum = FileMetadataMother.create({
      checksum: { algorithm: 'SHA-1', value: 'some-checksum' }
    })
    cy.customMount(
      <FileMetadata
        name={file.name}
        metadata={metadataWithChecksum}
        permissions={file.permissions}
        datasetPublishingStatus={file.datasetVersion.publishingStatus}
      />
    )

    cy.findByText('SHA-1').should('exist')
    cy.findByText('some-checksum').should('exist')
  })

  it('does not render the file checksum if it does not exist', () => {
    const metadataWithoutChecksum = FileMetadataMother.createWithNoChecksum()
    cy.customMount(
      <FileMetadata
        name={file.name}
        metadata={metadataWithoutChecksum}
        permissions={file.permissions}
        datasetPublishingStatus={file.datasetVersion.publishingStatus}
      />
    )

    cy.findByText('SHA-1').should('not.exist')
  })

  it('renders the file deposit date', () => {
    cy.customMount(
      <FileMetadata
        name={file.name}
        metadata={file.metadata}
        permissions={file.permissions}
        datasetPublishingStatus={file.datasetVersion.publishingStatus}
      />
    )

    cy.findByText('Deposit Date').should('exist')
    cy.findByText(DateHelper.toISO8601Format(file.metadata.depositDate)).should('exist')
  })

  it('renders the file Metadata Release Date', () => {
    const metadataWithPublicationDate = FileMetadataMother.createWithPublicationDate()
    cy.customMount(
      <FileMetadata
        name={file.name}
        metadata={metadataWithPublicationDate}
        permissions={file.permissions}
        datasetPublishingStatus={file.datasetVersion.publishingStatus}
      />
    )

    cy.findByText('Metadata Release Date').should('exist')
    if (metadataWithPublicationDate.publicationDate) {
      cy.findAllByText(
        DateHelper.toISO8601Format(metadataWithPublicationDate.publicationDate)
      ).should('exist')
    }
  })

  it('does not render the file Metadata Release Date if the publication date does not exist', () => {
    const metadataWithNoPublicationDate = FileMetadataMother.createWithNoPublicationDate()
    cy.customMount(
      <FileMetadata
        name={file.name}
        metadata={metadataWithNoPublicationDate}
        permissions={file.permissions}
        datasetPublishingStatus={file.datasetVersion.publishingStatus}
      />
    )

    cy.findByText('Metadata Release Date').should('not.exist')
  })

  it('renders the file Publication Date', () => {
    const metadataWithPublicationDate = FileMetadataMother.createWithPublicationDateNotEmbargoed()
    cy.customMount(
      <FileMetadata
        name={file.name}
        metadata={metadataWithPublicationDate}
        permissions={file.permissions}
        datasetPublishingStatus={file.datasetVersion.publishingStatus}
      />
    )

    cy.findByText('Publication Date').should('exist')
    if (metadataWithPublicationDate.publicationDate) {
      cy.findAllByText(
        DateHelper.toISO8601Format(metadataWithPublicationDate.publicationDate)
      ).should('exist')
    }
  })

  it('renders the file Publication Date with embargo', () => {
    const metadataWithPublicationDateEmbargoed =
      FileMetadataMother.createWithPublicationDateEmbargoed()
    cy.customMount(
      <FileMetadata
        name={file.name}
        metadata={metadataWithPublicationDateEmbargoed}
        permissions={file.permissions}
        datasetPublishingStatus={DatasetPublishingStatus.RELEASED}
      />
    )

    cy.findByText('Publication Date').should('exist')
    if (metadataWithPublicationDateEmbargoed.publicationDate) {
      cy.findAllByText(
        DateHelper.toISO8601Format(metadataWithPublicationDateEmbargoed.publicationDate)
      ).should('exist')
    }
  })

  it('does not render the file Publication Date if the publication date and embargo do not exist', () => {
    const metadataWithNoPublicationDate = FileMetadataMother.create({
      publicationDate: undefined,
      embargo: undefined
    })
    cy.customMount(
      <FileMetadata
        name={file.name}
        metadata={metadataWithNoPublicationDate}
        permissions={file.permissions}
        datasetPublishingStatus={file.datasetVersion.publishingStatus}
      />
    )

    cy.findByText('Publication Date').should('not.exist')
  })

  it('renders the file Embargo Reason', () => {
    const metadataWithEmbargoReason = FileMetadataMother.create({
      embargo: FileEmbargoMother.create({ reason: 'Some reason' })
    })
    cy.customMount(
      <FileMetadata
        name={file.name}
        metadata={metadataWithEmbargoReason}
        permissions={file.permissions}
        datasetPublishingStatus={file.datasetVersion.publishingStatus}
      />
    )

    cy.findByText('Embargo Reason').should('exist')
    cy.findByText('Some reason').should('exist')
  })

  it('does not render the file Embargo Reason if the embargo does not exist', () => {
    const metadataWithNoEmbargo = FileMetadataMother.createNotEmbargoed()
    cy.customMount(
      <FileMetadata
        name={file.name}
        metadata={metadataWithNoEmbargo}
        permissions={file.permissions}
        datasetPublishingStatus={file.datasetVersion.publishingStatus}
      />
    )

    cy.findByText('Embargo Reason').should('not.exist')
  })

  it('does not render the file Embargo Reason if the embargo reason does not exist', () => {
    const metadataWithNoEmbargoReason = FileMetadataMother.create({
      embargo: FileEmbargoMother.createWithNoReason({ reason: undefined })
    })
    cy.customMount(
      <FileMetadata
        name={file.name}
        metadata={metadataWithNoEmbargoReason}
        permissions={file.permissions}
        datasetPublishingStatus={file.datasetVersion.publishingStatus}
      />
    )

    cy.findByText('Embargo Reason').should('not.exist')
  })

  it('renders the file size', () => {
    const metadataWithFileSize = FileMetadataMother.create({
      size: FileSizeMother.create({ value: 123.03932894722, unit: FileSizeUnit.BYTES })
    })
    cy.customMount(
      <FileMetadata
        name={file.name}
        metadata={metadataWithFileSize}
        permissions={file.permissions}
        datasetPublishingStatus={file.datasetVersion.publishingStatus}
      />
    )

    cy.findByText('Size').should('exist')
    cy.findByText('123 B').should('exist')
  })

  it('renders the file type', () => {
    const metadataWithFileType = FileMetadataMother.create({
      type: FileTypeMother.createText()
    })
    cy.customMount(
      <FileMetadata
        name={file.name}
        metadata={metadataWithFileType}
        permissions={file.permissions}
        datasetPublishingStatus={file.datasetVersion.publishingStatus}
      />
    )

    cy.findByText('Type').should('exist')
    cy.findByText('Plain Text').should('exist')
  })

  it('renders the tabular data if it exists', () => {
    const metadataWithTabularData = FileMetadataMother.create({
      tabularData: FileTabularDataMother.create({ variablesCount: 123, observationsCount: 321 })
    })
    cy.customMount(
      <FileMetadata
        name={file.name}
        metadata={metadataWithTabularData}
        permissions={file.permissions}
        datasetPublishingStatus={file.datasetVersion.publishingStatus}
      />
    )

    cy.findByText('Variables').should('exist')
    cy.findByText('123').should('exist')
    cy.findByText('Observations').should('exist')
    cy.findByText('321').should('exist')
  })

  it('does not render the tabular data if it does not exist', () => {
    const metadataWithoutTabularData = FileMetadataMother.createNonTabular()
    cy.customMount(
      <FileMetadata
        name={file.name}
        metadata={metadataWithoutTabularData}
        permissions={file.permissions}
        datasetPublishingStatus={file.datasetVersion.publishingStatus}
      />
    )

    cy.findByText('Variables').should('not.exist')
    cy.findByText('Observations').should('not.exist')
  })

  it('renders the file directory', () => {
    const metadataWithDirectory = FileMetadataMother.create({
      directory: '/some/path'
    })
    cy.customMount(
      <FileMetadata
        name={file.name}
        metadata={metadataWithDirectory}
        permissions={file.permissions}
        datasetPublishingStatus={file.datasetVersion.publishingStatus}
      />
    )

    cy.findByText('File Path').should('exist')
    cy.findByText('/some/path').should('exist')
  })

  it('does not render the file directory if it does not exist', () => {
    const metadataWithoutDirectory = FileMetadataMother.createWithNoDirectory()
    cy.customMount(
      <FileMetadata
        name={file.name}
        metadata={metadataWithoutDirectory}
        permissions={file.permissions}
        datasetPublishingStatus={file.datasetVersion.publishingStatus}
      />
    )

    cy.findByText('File Path').should('not.exist')
  })

  it('renders the file description', () => {
    const metadataWithDescription = FileMetadataMother.create({
      description: 'Some description'
    })

    cy.customMount(
      <FileMetadata
        name={file.name}
        metadata={metadataWithDescription}
        permissions={file.permissions}
        datasetPublishingStatus={file.datasetVersion.publishingStatus}
      />
    )

    cy.findByText('Description').should('exist')
    cy.findByText('Some description').should('exist')
  })

  it('does not render the file description if it does not exist', () => {
    const metadataWithoutDescription = FileMetadataMother.createWithNoDescription()

    cy.customMount(
      <FileMetadata
        name={file.name}
        metadata={metadataWithoutDescription}
        permissions={file.permissions}
        datasetPublishingStatus={file.datasetVersion.publishingStatus}
      />
    )

    cy.findByText('Description').should('not.exist')
  })
})
