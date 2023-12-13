import { FilePreviewMother } from '../../../files/domain/models/FilePreviewMother'
import { FilePermissionsProvider } from '../../../../../src/sections/file/file-permissions/FilePermissionsProvider'
import { FileRepository } from '../../../../../src/files/domain/repositories/FileRepository'
import { FilePreview } from '../../../../../src/files/domain/models/FilePreview'
import { FileUserPermissionsMother } from '../../../files/domain/models/FileUserPermissionsMother'
import { FilesCountInfoMother } from '../../../files/domain/models/FilesCountInfoMother'
import { useFileDownloadPermission } from '../../../../../src/sections/file/file-permissions/useFileDownloadPermission'

const fileRepository: FileRepository = {} as FileRepository
function TestComponent({ file }: { file: FilePreview }) {
  const { sessionUserHasFileDownloadPermission } = useFileDownloadPermission(file)

  return (
    <div>
      {sessionUserHasFileDownloadPermission ? (
        <span>Has download permission</span>
      ) : (
        <span>Does not have download permission</span>
      )}
    </div>
  )
}

describe('useFileDownloadPermission', () => {
  beforeEach(() => {
    fileRepository.getAllByDatasetPersistentId = cy.stub().resolves([])
    fileRepository.getFilesCountInfoByDatasetPersistentId = cy
      .stub()
      .resolves(FilesCountInfoMother.create())
  })

  it('should return file download permission', () => {
    const file = FilePreviewMother.createDeaccessioned()
    fileRepository.getUserPermissionsById = cy
      .stub()
      .resolves(FileUserPermissionsMother.create({ fileId: file.id, canEditDataset: true }))

    cy.mount(
      <FilePermissionsProvider repository={fileRepository}>
        <TestComponent file={file} />
      </FilePermissionsProvider>
    )

    cy.wrap(fileRepository.getUserPermissionsById).should('be.calledWith', file.id)
    cy.findByText('Has download permission').should('exist')
  })

  it('should return false for file download permission if there is an error', () => {
    const file = FilePreviewMother.createDeaccessioned()
    fileRepository.getUserPermissionsById = cy
      .stub()
      .rejects(new Error('Error getting file user permissions'))

    cy.mount(
      <FilePermissionsProvider repository={fileRepository}>
        <TestComponent file={file} />
      </FilePermissionsProvider>
    )

    cy.wrap(fileRepository.getUserPermissionsById).should('be.calledWith', file.id)
    cy.findByText('Does not have download permission').should('exist')
  })
})
