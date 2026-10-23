import { DatasetUploadFilesButton } from '../../../../../../src/sections/dataset/dataset-files/dataset-upload-files-button/DatasetUploadFilesButton'
import { ReactNode } from 'react'
import { DatasetProvider } from '../../../../../../src/sections/dataset/DatasetProvider'
import {
  DatasetLockMother,
  DatasetMother,
  DatasetPermissionsMother,
  DatasetVersionMother
} from '../../../../dataset/domain/models/DatasetMother'
import { DatasetRepository } from '../../../../../../src/dataset/domain/repositories/DatasetRepository'
import { Dataset as DatasetModel } from '../../../../../../src/dataset/domain/models/Dataset'

const datasetRepository: DatasetRepository = {} as DatasetRepository
const datasetWithUpdatePermissions = DatasetMother.create({
  permissions: DatasetPermissionsMother.createWithUpdateDatasetAllowed()
})

describe('DatasetUploadFilesButton', () => {
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

  it('renders the upload files button', () => {
    cy.mountAuthenticated(withDataset(<DatasetUploadFilesButton />, datasetWithUpdatePermissions))

    cy.findByRole('button', { name: 'Upload Files' }).should('exist')
  })

  it('does not render the upload files button when user is not logged in', () => {
    cy.customMount(withDataset(<DatasetUploadFilesButton />, datasetWithUpdatePermissions))

    cy.findByRole('button', { name: 'Upload Files' }).should('not.exist')
  })

  it('does not render the upload files button when user do not have dataset update permissions', () => {
    cy.mountAuthenticated(<DatasetUploadFilesButton />)

    cy.findByRole('button', { name: 'Upload Files' }).should('not.exist')
  })

  it('does not render the upload files button when the dataset storage driver is not S3-compatible', () => {
    const datasetWithFileStorage = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithUpdateDatasetAllowed(),
      storageDriver: {
        name: 'localfs1',
        type: 'file',
        label: 'LocalFilesystem',
        directUpload: false,
        directDownload: false
      }
    })
    cy.mountAuthenticated(withDataset(<DatasetUploadFilesButton />, datasetWithFileStorage))

    cy.findByRole('button', { name: 'Upload Files' }).should('not.exist')
  })

  it('does not render the upload files button when the S3 driver lacks direct-upload', () => {
    const datasetS3WithoutDirectUpload = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithUpdateDatasetAllowed(),
      storageDriver: {
        name: 's3',
        type: 's3',
        label: 'S3',
        directUpload: false,
        directDownload: true
      }
    })
    cy.mountAuthenticated(withDataset(<DatasetUploadFilesButton />, datasetS3WithoutDirectUpload))

    cy.findByRole('button', { name: 'Upload Files' }).should('not.exist')
  })

  it('renders the upload files button for an S3-compatible driver registered under a non-s3 id', () => {
    const datasetMinIO = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithUpdateDatasetAllowed(),
      storageDriver: {
        name: 'minio1',
        type: 's3',
        label: 'MinIO',
        directUpload: true,
        directDownload: true
      }
    })
    cy.mountAuthenticated(withDataset(<DatasetUploadFilesButton />, datasetMinIO))

    cy.findByRole('button', { name: 'Upload Files' }).should('exist')
  })

  it('renders the button disabled when dataset is locked from edits', () => {
    const datasetWithUpdatePermissions = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithUpdateDatasetAllowed(),
      locks: [DatasetLockMother.createLockedInEditInProgress()]
    })

    cy.mountAuthenticated(withDataset(<DatasetUploadFilesButton />, datasetWithUpdatePermissions))

    cy.findByRole('button', { name: 'Upload Files' }).should('exist').should('be.disabled')
  })

  it('test click', () => {
    cy.mountAuthenticated(withDataset(<DatasetUploadFilesButton />, datasetWithUpdatePermissions))

    cy.findByRole('button', { name: 'Upload Files' }).click()
  })

  it('test click with a draft dataset version', () => {
    const draftDatasetVersion = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithUpdateDatasetAllowed(),
      version: DatasetVersionMother.createDraft()
    })

    cy.mountAuthenticated(withDataset(<DatasetUploadFilesButton />, draftDatasetVersion))

    cy.findByRole('button', { name: 'Upload Files' }).click()
  })
})
