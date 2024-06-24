import { ReactNode } from 'react'
import { Dataset as DatasetModel } from '../../../../../../../../src/dataset/domain/models/Dataset'
import { DatasetProvider } from '../../../../../../../../src/sections/dataset/DatasetProvider'
import { DatasetRepository } from '../../../../../../../../src/dataset/domain/repositories/DatasetRepository'
import {
  DatasetMother,
  DatasetPermissionsMother
} from '../../../../../../dataset/domain/models/DatasetMother'
import { DownloadFilesButton } from '../../../../../../../../src/sections/dataset/dataset-files/files-table/file-actions/download-files/DownloadFilesButton'
import { FileMetadataMother } from '../../../../../../files/domain/models/FileMetadataMother'
import { MultipleFileDownloadProvider } from '../../../../../../../../src/sections/file/multiple-file-download/MultipleFileDownloadProvider'
import { FileRepository } from '../../../../../../../../src/files/domain/repositories/FileRepository'
import { FilePreviewMother } from '../../../../../../files/domain/models/FilePreviewMother'

const datasetRepository: DatasetRepository = {} as DatasetRepository
const fileRepository = {} as FileRepository
describe('DownloadFilesButton', () => {
  const withDataset = (component: ReactNode, dataset: DatasetModel | undefined) => {
    datasetRepository.getByPersistentId = cy.stub().resolves(dataset)
    datasetRepository.getByPrivateUrlToken = cy.stub().resolves(dataset)

    return (
      <DatasetProvider
        repository={datasetRepository}
        searchParams={{ persistentId: 'some-persistent-id', version: 'some-version' }}>
        {component}
      </DatasetProvider>
    )
  }

  beforeEach(() => {
    fileRepository.getMultipleFileDownloadUrl = cy
      .stub()
      .returns('https://multiple-file-download-url')
  })

  it('renders the Download Files button if there is more than 1 file in the dataset and the user has download files permission', () => {
    const datasetWithDownloadFilesPermission = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithFilesDownloadAllowed()
    })
    const files = FilePreviewMother.createMany(2)
    cy.mountAuthenticated(
      withDataset(
        <DownloadFilesButton files={files} fileSelection={{}} />,
        datasetWithDownloadFilesPermission
      )
    )

    cy.get('#download-files').should('exist')
  })

  it('does not render the Download Files button if there is only 1 file in the dataset', () => {
    const datasetWithDownloadFilesPermission = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithFilesDownloadAllowed()
    })
    const files = FilePreviewMother.createMany(1)
    cy.mountAuthenticated(
      withDataset(
        <DownloadFilesButton files={files} fileSelection={{}} />,
        datasetWithDownloadFilesPermission
      )
    )

    cy.get('#download-files').should('not.exist')
  })

  it('does not render the Download Files button if the user does not have download files permission', () => {
    const datasetWithoutDownloadFilesPermission = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithFilesDownloadNotAllowed()
    })
    const files = FilePreviewMother.createMany(2)
    cy.mountAuthenticated(
      withDataset(
        <DownloadFilesButton files={files} fileSelection={{}} />,
        datasetWithoutDownloadFilesPermission
      )
    )

    cy.get('#download-files').should('not.exist')
  })

  it('renders the Download Files button as a dropdown if there are tabular files in the dataset', () => {
    const datasetWithDownloadFilesPermission = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithFilesDownloadAllowed(),
      hasOneTabularFileAtLeast: true
    })
    const files = FilePreviewMother.createMany(2, {
      metadata: FileMetadataMother.createTabular()
    })
    cy.mountAuthenticated(
      withDataset(
        <DownloadFilesButton files={files} fileSelection={{}} />,
        datasetWithDownloadFilesPermission
      )
    )

    cy.get('#download-files').click()
    cy.findByRole('button', { name: 'Original Format' }).should('exist')
    cy.findByRole('button', { name: 'Archival Format (.tab)' }).should('exist')
  })

  it('does not render the Download Files button as a dropdown if there are no tabular files in the dataset', () => {
    const datasetWithDownloadFilesPermission = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithFilesDownloadAllowed(),
      hasOneTabularFileAtLeast: false
    })
    const files = FilePreviewMother.createMany(2, {
      metadata: FileMetadataMother.createNonTabular()
    })
    cy.mountAuthenticated(
      withDataset(
        <DownloadFilesButton files={files} fileSelection={{}} />,
        datasetWithDownloadFilesPermission
      )
    )

    cy.get('#download-files').click()
    cy.findByRole('button', { name: 'Original Format' }).should('not.exist')
    cy.findByRole('button', { name: 'Archival Format (.tab)' }).should('not.exist')
  })

  it('shows the No Selected Files modal if no files are selected', () => {
    const datasetWithDownloadFilesPermission = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithFilesDownloadAllowed(),
      hasOneTabularFileAtLeast: false
    })
    const files = FilePreviewMother.createMany(2, {
      metadata: FileMetadataMother.createNonTabular()
    })
    cy.mountAuthenticated(
      withDataset(
        <DownloadFilesButton files={files} fileSelection={{}} />,
        datasetWithDownloadFilesPermission
      )
    )

    cy.get('#download-files').click()
    cy.findByText('Select File(s)').should('exist')
  })

  it('renders the download url for the selected files when some files are selected and there are no tabular files', () => {
    const datasetWithDownloadFilesPermission = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithFilesDownloadAllowed(),
      hasOneTabularFileAtLeast: false
    })
    const files = FilePreviewMother.createMany(2, {
      metadata: FileMetadataMother.createNonTabular()
    })
    const fileSelection = {
      'some-file-id': files[0],
      'some-other-file-id': files[1]
    }
    cy.mountAuthenticated(
      <MultipleFileDownloadProvider repository={fileRepository}>
        {withDataset(
          <DownloadFilesButton files={files} fileSelection={fileSelection} />,
          datasetWithDownloadFilesPermission
        )}
      </MultipleFileDownloadProvider>
    )

    cy.get('#download-files')
      .parent('a')
      .should('have.attr', 'href', 'https://multiple-file-download-url')
  })

  it('renders the download url for the selected files when some files are selected and there are tabular files', () => {
    const datasetWithDownloadFilesPermission = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithFilesDownloadAllowed(),
      hasOneTabularFileAtLeast: true
    })
    const files = FilePreviewMother.createMany(2, {
      metadata: FileMetadataMother.createTabular()
    })
    const fileSelection = {
      'some-file-id': files[0],
      'some-other-file-id': files[1]
    }
    cy.mountAuthenticated(
      <MultipleFileDownloadProvider repository={fileRepository}>
        {withDataset(
          <DownloadFilesButton files={files} fileSelection={fileSelection} />,
          datasetWithDownloadFilesPermission
        )}
      </MultipleFileDownloadProvider>
    )

    cy.get('#download-files').click()
    cy.findByRole('link', { name: 'Original Format' }).should(
      'have.attr',
      'href',
      'https://multiple-file-download-url'
    )
    cy.findByRole('link', { name: 'Archival Format (.tab)' }).should(
      'have.attr',
      'href',
      'https://multiple-file-download-url'
    )
  })

  it('renders the dataset download url when all the files are selected', () => {
    const datasetWithDownloadFilesPermission = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithFilesDownloadAllowed(),
      hasOneTabularFileAtLeast: true,
      downloadUrls: {
        original: 'https://dataset-download-url-original',
        archival: 'https://dataset-download-url-archival'
      }
    })
    const files = FilePreviewMother.createMany(2, {
      metadata: FileMetadataMother.createTabular()
    })
    const fileSelection = {
      'some-file-id': undefined,
      'some-other-file-id': undefined
    }
    cy.mountAuthenticated(
      withDataset(
        <DownloadFilesButton files={files} fileSelection={fileSelection} />,
        datasetWithDownloadFilesPermission
      )
    )

    cy.get('#download-files').click()
    cy.findByRole('link', { name: 'Original Format' }).should(
      'have.attr',
      'href',
      'https://dataset-download-url-original'
    )
    cy.findByRole('link', { name: 'Archival Format (.tab)' }).should(
      'have.attr',
      'href',
      'https://dataset-download-url-archival'
    )
  })

  it('renders the dataset download url with the single file download url when one file is selected', () => {
    const datasetWithDownloadFilesPermission = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithFilesDownloadAllowed(),
      hasOneTabularFileAtLeast: true
    })
    const files = FilePreviewMother.createMany(2, {
      metadata: FileMetadataMother.createTabular()
    })
    const fileSelection = {
      'some-file-id': files[0]
    }
    fileRepository.getFileDownloadUrl = cy.stub().returns('https://single-file-download-url')
    cy.mountAuthenticated(
      <MultipleFileDownloadProvider repository={fileRepository}>
        {withDataset(
          <DownloadFilesButton files={files} fileSelection={fileSelection} />,
          datasetWithDownloadFilesPermission
        )}
      </MultipleFileDownloadProvider>
    )

    cy.get('#download-files').click()
    cy.findByRole('link', { name: 'Original Format' }).should(
      'have.attr',
      'href',
      'https://single-file-download-url'
    )
    cy.findByRole('link', { name: 'Archival Format (.tab)' }).should(
      'have.attr',
      'href',
      'https://single-file-download-url'
    )
  })
})
