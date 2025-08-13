import { FileActionButtons } from '../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-action-buttons/FileActionButtons'
import { DatasetRepository } from '../../../../../../../../../src/dataset/domain/repositories/DatasetRepository'
import {
  DatasetMother,
  DatasetPermissionsMother
} from '../../../../../../../dataset/domain/models/DatasetMother'
import { DatasetProvider } from '../../../../../../../../../src/sections/dataset/DatasetProvider'
import { FilePreviewMother } from '../../../../../../../files/domain/models/FilePreviewMother'
import { FileRepository } from '@/files/domain/repositories/FileRepository'

const file = FilePreviewMother.createDefault()
const fileRepository: FileRepository = {} as FileRepository

describe('FileActionButtons', () => {
  it('renders the file action buttons', () => {
    cy.customMount(<FileActionButtons file={file} fileRepository={fileRepository} />)

    cy.findByRole('group', { name: 'File Action Buttons' }).should('exist')
    cy.findByRole('button', { name: 'Access File' }).should('exist')
  })

  it('renders the file action buttons with user logged in and edit dataset permissions', () => {
    const datasetRepository: DatasetRepository = {} as DatasetRepository
    const datasetWithUpdatePermissions = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithUpdateDatasetAllowed(),
      hasValidTermsOfAccess: true
    })
    datasetRepository.getByPersistentId = cy.stub().resolves(datasetWithUpdatePermissions)
    datasetRepository.getByPrivateUrlToken = cy.stub().resolves(datasetWithUpdatePermissions)

    cy.mountAuthenticated(
      <DatasetProvider
        repository={datasetRepository}
        searchParams={{ persistentId: 'some-persistent-id', version: 'some-version' }}>
        <FileActionButtons file={file} fileRepository={fileRepository} />
      </DatasetProvider>
    )

    cy.findByRole('group', { name: 'File Action Buttons' }).should('exist')
    cy.findByRole('button', { name: 'Access File' }).should('exist')
    cy.findByRole('button', { name: 'File Options' }).should('exist')
  })
})
