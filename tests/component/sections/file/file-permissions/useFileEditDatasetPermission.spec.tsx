import { FileMother } from '../../../files/domain/models/FileMother'
import { FilePermissionsProvider } from '../../../../../src/sections/file/file-permissions/FilePermissionsProvider'
import { FileRepository } from '../../../../../src/files/domain/repositories/FileRepository'
import { File } from '../../../../../src/files/domain/models/File'
import { FileUserPermissionsMother } from '../../../files/domain/models/FileUserPermissionsMother'
import { FilesCountInfoMother } from '../../../files/domain/models/FilesCountInfoMother'
import { useFileEditDatasetPermission } from '../../../../../src/sections/file/file-permissions/useFileEditDatasetPermission'

const fileRepository: FileRepository = {} as FileRepository
function TestComponent({ file }: { file: File }) {
  const { sessionUserHasEditDatasetPermission } = useFileEditDatasetPermission(file)

  return (
    <div>
      {sessionUserHasEditDatasetPermission ? (
        <span>Has edit dataset permission</span>
      ) : (
        <span>Does not have edit dataset permission</span>
      )}
    </div>
  )
}

describe('useFileEditDatasetPermission', () => {
  beforeEach(() => {
    fileRepository.getAllByDatasetPersistentId = cy.stub().resolves([])
    fileRepository.getFilesCountInfoByDatasetPersistentId = cy
      .stub()
      .resolves(FilesCountInfoMother.create())
  })

  it('should return edit dataset permission', () => {
    const file = FileMother.createDefault()
    fileRepository.getUserPermissionsById = cy
      .stub()
      .resolves(FileUserPermissionsMother.create({ fileId: file.id, canEditDataset: true }))

    cy.mount(
      <FilePermissionsProvider repository={fileRepository}>
        <TestComponent file={file} />
      </FilePermissionsProvider>
    )

    cy.wrap(fileRepository.getUserPermissionsById).should('be.calledWith', file.id)
    cy.findByText('Has edit dataset permission').should('exist')
  })

  it('should return false for edit dataset permission if there is an error', () => {
    const file = FileMother.createDefault()
    fileRepository.getUserPermissionsById = cy
      .stub()
      .rejects(new Error('Error getting file user permissions'))

    cy.mount(
      <FilePermissionsProvider repository={fileRepository}>
        <TestComponent file={file} />
      </FilePermissionsProvider>
    )

    cy.wrap(fileRepository.getUserPermissionsById).should('be.calledWith', file.id)
    cy.findByText('Does not have edit dataset permission').should('exist')
  })
})
