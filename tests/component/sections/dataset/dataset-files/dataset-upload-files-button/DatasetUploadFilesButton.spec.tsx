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

  // Temporary interception until we have the getDatasetFileStore method in the repository
  const interceptGetDatasetFileStore = (datasetId: number, message = 's3') => {
    cy.intercept('GET', `/api/datasets/${datasetId}/storageDriver`, {
      body: {
        data: { message: message }
      }
    }).as('getDatasetFileStore')
  }

  it('renders the upload files button', () => {
    interceptGetDatasetFileStore(datasetWithUpdatePermissions.id)
    cy.mountAuthenticated(withDataset(<DatasetUploadFilesButton />, datasetWithUpdatePermissions))

    cy.findByRole('button', { name: 'Upload Files' }).should('exist')
  })

  it('does not render the upload files button when user is not logged in', () => {
    interceptGetDatasetFileStore(datasetWithUpdatePermissions.id)
    cy.customMount(withDataset(<DatasetUploadFilesButton />, datasetWithUpdatePermissions))

    cy.findByRole('button', { name: 'Upload Files' }).should('not.exist')
  })

  it('does not render the upload files button when user do not have dataset update permissions', () => {
    cy.mountAuthenticated(<DatasetUploadFilesButton />)

    cy.findByRole('button', { name: 'Upload Files' }).should('not.exist')
  })

  it('does not render the upload files button if dataset file store does not start with "s3"', () => {
    interceptGetDatasetFileStore(datasetWithUpdatePermissions.id, 'not-s3')

    cy.mountAuthenticated(withDataset(<DatasetUploadFilesButton />, datasetWithUpdatePermissions))

    cy.findByRole('button', { name: 'Upload Files' }).should('not.exist')
  })

  it('renders the button disabled when dataset is locked from edits', () => {
    const datasetWithUpdatePermissions = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithUpdateDatasetAllowed(),
      locks: [DatasetLockMother.createLockedInEditInProgress()]
    })
    interceptGetDatasetFileStore(datasetWithUpdatePermissions.id)

    cy.mountAuthenticated(withDataset(<DatasetUploadFilesButton />, datasetWithUpdatePermissions))

    cy.findByRole('button', { name: 'Upload Files' }).should('exist').should('be.disabled')
  })

  it('test click', () => {
    interceptGetDatasetFileStore(datasetWithUpdatePermissions.id)
    cy.mountAuthenticated(withDataset(<DatasetUploadFilesButton />, datasetWithUpdatePermissions))

    cy.findByRole('button', { name: 'Upload Files' }).click()
  })

  it('test click with a draft dataset version', () => {
    const draftDatasetVersion = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithUpdateDatasetAllowed(),
      version: DatasetVersionMother.createDraft()
    })
    interceptGetDatasetFileStore(draftDatasetVersion.id)
    cy.mountAuthenticated(withDataset(<DatasetUploadFilesButton />, draftDatasetVersion))

    cy.findByRole('button', { name: 'Upload Files' }).click()
  })
})
