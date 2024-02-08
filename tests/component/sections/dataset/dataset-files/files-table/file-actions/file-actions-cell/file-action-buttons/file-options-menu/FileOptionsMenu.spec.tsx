import { FileOptionsMenu } from '../../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-action-buttons/file-options-menu/FileOptionsMenu'
import { ReactNode } from 'react'
import { Dataset as DatasetModel } from '../../../../../../../../../../src/dataset/domain/models/Dataset'
import { DatasetProvider } from '../../../../../../../../../../src/sections/dataset/DatasetProvider'
import { DatasetRepository } from '../../../../../../../../../../src/dataset/domain/repositories/DatasetRepository'
import {
  DatasetLockMother,
  DatasetMother,
  DatasetPermissionsMother
} from '../../../../../../../../dataset/domain/models/DatasetMother'
import { FilePreviewMother } from '../../../../../../../../files/domain/models/FilePreviewMother'

const file = FilePreviewMother.createDefault()
const datasetRepository: DatasetRepository = {} as DatasetRepository
const datasetWithUpdatePermissions = DatasetMother.create({
  permissions: DatasetPermissionsMother.createWithUpdateDatasetAllowed(),
  hasValidTermsOfAccess: true
})
describe('FileOptionsMenu', () => {
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

  it('renders the FileOptionsMenu', () => {
    cy.mountAuthenticated(
      withDataset(<FileOptionsMenu file={file} />, datasetWithUpdatePermissions)
    )
    cy.findByRole('button', { name: 'File Options' }).should('exist')
  })

  it('renders the file options menu with tooltip', () => {
    cy.mountAuthenticated(
      withDataset(<FileOptionsMenu file={file} />, datasetWithUpdatePermissions)
    )

    cy.findByRole('button', { name: 'File Options' }).trigger('mouseover')
    cy.findByRole('tooltip', { name: 'File Options' }).should('exist')
  })

  it('renders the dropdown header', () => {
    cy.mountAuthenticated(
      withDataset(<FileOptionsMenu file={file} />, datasetWithUpdatePermissions)
    )

    cy.findByRole('button', { name: 'File Options' }).should('exist').click()
    cy.findByRole('heading', { name: 'Edit Options' }).should('exist')
  })

  it('does not render is the user is not authenticated', () => {
    cy.customMount(withDataset(<FileOptionsMenu file={file} />, datasetWithUpdatePermissions))

    cy.findByRole('button', { name: 'File Options' }).should('not.exist')
  })

  it('does not render is the user do not have permissions to update the dataset', () => {
    const datasetWithNoUpdatePermissions = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithUpdateDatasetNotAllowed()
    })
    cy.mountAuthenticated(
      withDataset(<FileOptionsMenu file={file} />, datasetWithNoUpdatePermissions)
    )
    cy.findByRole('button', { name: 'File Options' }).should('not.exist')
  })

  it('does not render if there are not valid terms of access', () => {
    const datasetWithNoTermsOfAccess = DatasetMother.create({
      hasValidTermsOfAccess: false
    })
    cy.mountAuthenticated(withDataset(<FileOptionsMenu file={file} />, datasetWithNoTermsOfAccess))
    cy.findByRole('button', { name: 'File Options' }).should('not.exist')
  })

  it('renders disabled menu if dataset is locked from edits', () => {
    const datasetLockedFromEdits = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithUpdateDatasetAllowed(),
      locks: [DatasetLockMother.createLockedInEditInProgress()],
      hasValidTermsOfAccess: true
    })
    cy.mountAuthenticated(withDataset(<FileOptionsMenu file={file} />, datasetLockedFromEdits))

    cy.findByRole('button', { name: 'File Options' }).should('exist').should('be.disabled')
  })

  it('opens fileAlreadyDeletedPrevious modal if file is already deleted', () => {
    const file = FilePreviewMother.createDeleted()

    cy.mountAuthenticated(
      withDataset(<FileOptionsMenu file={file} />, datasetWithUpdatePermissions)
    )
    cy.findByRole('button', { name: 'File Options' }).should('exist').click()

    cy.findByRole('dialog').should('exist')
    cy.findAllByText('Edit File').should('exist')
    cy.findAllByText(
      'This file has already been deleted (or replaced) in the current version. It may not be edited.'
    ).should('exist')
  })

  it('renders the menu options', () => {
    cy.mountAuthenticated(
      withDataset(<FileOptionsMenu file={file} />, datasetWithUpdatePermissions)
    )
    cy.findByRole('button', { name: 'File Options' }).click()
    cy.findByRole('button', { name: 'Metadata' }).should('exist')
  })
})
