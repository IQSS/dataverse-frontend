import { FileActionButtons } from '../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-action-buttons/FileActionButtons'
import { DatasetRepository } from '../../../../../../../../../src/dataset/domain/repositories/DatasetRepository'
import {
  DatasetMother,
  DatasetPermissionsMother
} from '../../../../../../../dataset/domain/models/DatasetMother'
import { DatasetProvider } from '../../../../../../../../../src/sections/dataset/DatasetProvider'
import { FilePreviewMother } from '../../../../../../../files/domain/models/FilePreviewMother'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { WithRepositories } from '@tests/component/WithRepositories'

const file = FilePreviewMother.createDefault()
const fileRepository: FileRepository = {} as FileRepository
const datasetRepository: DatasetRepository = {} as DatasetRepository

describe('FileActionButtons', () => {
  it('renders the file action buttons', () => {
    cy.customMount(
      <WithRepositories datasetRepository={datasetRepository}>
        <FileActionButtons file={file} fileRepository={fileRepository} />
      </WithRepositories>
    )

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
      <WithRepositories datasetRepository={datasetRepository}>
        <DatasetProvider
          repository={datasetRepository}
          searchParams={{ persistentId: 'some-persistent-id', version: 'some-version' }}>
          <FileActionButtons file={file} fileRepository={fileRepository} />
        </DatasetProvider>
      </WithRepositories>
    )

    cy.findByRole('group', { name: 'File Action Buttons' }).should('exist')
    cy.findByRole('button', { name: 'Access File' }).should('exist')
    cy.findByRole('button', { name: 'File Options' }).should('exist')
  })
})
