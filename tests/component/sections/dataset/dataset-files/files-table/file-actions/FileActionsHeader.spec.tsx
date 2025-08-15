import { FileActionsHeader } from '../../../../../../../src/sections/dataset/dataset-files/files-table/file-actions/FileActionsHeader'
import { DatasetProvider } from '../../../../../../../src/sections/dataset/DatasetProvider'
import { DatasetRepository } from '../../../../../../../src/dataset/domain/repositories/DatasetRepository'
import {
  DatasetMother,
  DatasetPermissionsMother
} from '../../../../../dataset/domain/models/DatasetMother'
import { FilePreviewMother } from '../../../../../files/domain/models/FilePreviewMother'
import { FileRepository } from '@/files/domain/repositories/FileRepository'

describe('FileActionsHeader', () => {
  it('renders the file actions header', () => {
    const datasetRepository: DatasetRepository = {} as DatasetRepository
    const fileRepository: FileRepository = {} as FileRepository
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
        <FileActionsHeader
          files={files}
          fileSelection={{}}
          fileRepository={fileRepository}
          datasetRepository={datasetRepository}
        />
      </DatasetProvider>
    )

    cy.get('#edit-files-menu').should('exist')
    cy.get('#download-files').should('exist')
  })
})
