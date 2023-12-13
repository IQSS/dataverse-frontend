import { FileActionsHeader } from '../../../../../../../src/sections/dataset/dataset-files/files-table/file-actions/FileActionsHeader'
import { FilePreviewMother } from '../../../../../files/domain/models/FilePreviewMother'
import { DatasetProvider } from '../../../../../../../src/sections/dataset/DatasetProvider'
import { DatasetRepository } from '../../../../../../../src/dataset/domain/repositories/DatasetRepository'
import {
  DatasetMother,
  DatasetPermissionsMother
} from '../../../../../dataset/domain/models/DatasetMother'

describe('FileActionsHeader', () => {
  it('renders the file actions header', () => {
    const datasetRepository: DatasetRepository = {} as DatasetRepository
    const datasetWithUpdatePermissions = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithAllAllowed(),
      hasValidTermsOfAccess: true
    })
    datasetRepository.getByPersistentId = cy.stub().resolves(datasetWithUpdatePermissions)
    const files = FilePreviewMother.createMany(2)
    cy.mountAuthenticated(
      <DatasetProvider
        repository={datasetRepository}
        searchParams={{ persistentId: 'some-persistent-id', version: 'some-version' }}>
        <FileActionsHeader files={files} fileSelection={{}} />
      </DatasetProvider>
    )

    cy.findByRole('button', { name: 'Edit Files' }).should('exist')
    cy.findByRole('button', { name: 'Download' }).should('exist')
  })
})
