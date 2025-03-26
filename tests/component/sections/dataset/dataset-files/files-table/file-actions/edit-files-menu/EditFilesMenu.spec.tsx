import { EditFilesMenu } from '../../../../../../../../src/sections/dataset/dataset-files/files-table/file-actions/edit-files-menu/EditFilesMenu'
import { ReactNode } from 'react'
import { Dataset as DatasetModel } from '../../../../../../../../src/dataset/domain/models/Dataset'
import { DatasetProvider } from '../../../../../../../../src/sections/dataset/DatasetProvider'
import { DatasetRepository } from '../../../../../../../../src/dataset/domain/repositories/DatasetRepository'
import {
  DatasetLockMother,
  DatasetMother,
  DatasetPermissionsMother
} from '../../../../../../dataset/domain/models/DatasetMother'
import { FilePreviewMother } from '../../../../../../files/domain/models/FilePreviewMother'
import { FileRepository } from '@/files/domain/repositories/FileRepository'

const datasetRepository: DatasetRepository = {} as DatasetRepository
const fileRepository: FileRepository = {} as FileRepository
const datasetWithUpdatePermissions = DatasetMother.create({
  permissions: DatasetPermissionsMother.createWithUpdateDatasetAllowed(),
  hasValidTermsOfAccess: true
})
const files = FilePreviewMother.createMany(2)
describe('EditFilesMenu', () => {
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

  it('renders the Edit Files menu', () => {
    cy.mountAuthenticated(
      withDataset(
        <EditFilesMenu files={files} fileSelection={{}} fileRepository={fileRepository} />,
        datasetWithUpdatePermissions
      )
    )

    cy.get('#edit-files-menu').should('exist')
  })

  it('does not render the Edit Files menu when the user is not authenticated', () => {
    cy.customMount(
      withDataset(
        <EditFilesMenu files={files} fileSelection={{}} fileRepository={fileRepository} />,
        datasetWithUpdatePermissions
      )
    )

    cy.get('#edit-files-menu').should('not.exist')
  })

  it('does not render the Edit Files menu when there are no files in the dataset', () => {
    cy.mountAuthenticated(
      withDataset(
        <EditFilesMenu files={[]} fileSelection={{}} fileRepository={fileRepository} />,
        datasetWithUpdatePermissions
      )
    )

    cy.get('#edit-files-menu').should('not.exist')
  })

  it('renders the Edit Files options', () => {
    cy.mountAuthenticated(
      withDataset(
        <EditFilesMenu files={files} fileSelection={{}} fileRepository={fileRepository} />,
        datasetWithUpdatePermissions
      )
    )

    cy.get('#edit-files-menu').click()
    cy.findByRole('button', { name: 'Metadata' }).should('exist')
  })

  it('does not render the Edit Files menu when the user does not have update dataset permissions', () => {
    const datasetWithNoUpdatePermissions = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithUpdateDatasetNotAllowed()
    })

    cy.mountAuthenticated(
      withDataset(
        <EditFilesMenu files={files} fileSelection={{}} fileRepository={fileRepository} />,
        datasetWithNoUpdatePermissions
      )
    )

    cy.get('#edit-files-menu').should('not.exist')
  })

  it('renders the disabled Edit Files menu when the dataset is locked from edits', () => {
    const datasetWithUpdatePermissions = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithUpdateDatasetAllowed(),
      locks: [DatasetLockMother.createLockedInEditInProgress()]
    })

    cy.mountAuthenticated(
      withDataset(
        <EditFilesMenu files={files} fileSelection={{}} fileRepository={fileRepository} />,
        datasetWithUpdatePermissions
      )
    )

    cy.get('#edit-files-menu').should('be.disabled')
  })

  it('renders the disabled Edit Files menu when the dataset does not have valid terms of access', () => {
    const datasetWithUpdatePermissions = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithUpdateDatasetAllowed(),
      hasValidTermsOfAccess: false
    })

    cy.mountAuthenticated(
      withDataset(
        <EditFilesMenu files={files} fileSelection={{}} fileRepository={fileRepository} />,
        datasetWithUpdatePermissions
      )
    )

    cy.get('#edit-files-menu').should('be.disabled')
  })
})
