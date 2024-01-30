import { useFilePermissions } from '../../../../../src/sections/file/file-permissions/FilePermissionsContext'
import { FilePermission } from '../../../../../src/files/domain/models/FileUserPermissions'
import { FilePreviewMother } from '../../../files/domain/models/FilePreviewMother'
import { useEffect, useState } from 'react'
import { FilePermissionsProvider } from '../../../../../src/sections/file/file-permissions/FilePermissionsProvider'
import { FileRepository } from '../../../../../src/files/domain/repositories/FileRepository'
import { FilePreview } from '../../../../../src/files/domain/models/FilePreview'
import { FileUserPermissionsMother } from '../../../files/domain/models/FileUserPermissionsMother'
import { FilesCountInfoMother } from '../../../files/domain/models/FilesCountInfoMother'
import { AnonymizedContext } from '../../../../../src/sections/dataset/anonymized/AnonymizedContext'

const fileRepository: FileRepository = {} as FileRepository

function SavedPermissionsTestComponent({
  file,
  permission
}: {
  file: FilePreview
  permission: FilePermission
}) {
  const { checkSessionUserHasFilePermission } = useFilePermissions()
  const [hasFilePermission, setHasFilePermission] = useState<boolean>(false)
  const [hasFilePermissionAgain, setHasFilePermissionAgain] = useState<boolean>(false)
  useEffect(() => {
    checkSessionUserHasFilePermission(permission, file)
      .then((hasPermission) => {
        setHasFilePermission(hasPermission)
      })
      .then(() => {
        return checkSessionUserHasFilePermission(permission, file).then((hasPermission) => {
          setHasFilePermissionAgain(hasPermission)
        })
      })
      .catch((error) => {
        console.error('There was an error getting the file permission', error)
      })
  }, [file])

  return (
    <div>
      {hasFilePermission ? (
        <span>Has file permission</span>
      ) : (
        <span>Does not have file permission</span>
      )}
      {hasFilePermissionAgain ? (
        <span>Has file permission again</span>
      ) : (
        <span>Does not have file permission again</span>
      )}
    </div>
  )
}

function TestComponent({ file, permission }: { file: FilePreview; permission: FilePermission }) {
  const { checkSessionUserHasFilePermission } = useFilePermissions()
  const [hasFilePermission, setHasFilePermission] = useState<boolean>(false)
  useEffect(() => {
    checkSessionUserHasFilePermission(permission, file)
      .then((hasPermission) => {
        setHasFilePermission(hasPermission)
      })
      .catch((error) => {
        console.error('There was an error getting the file  permission', error)
      })
  }, [file])

  return (
    <div>
      {hasFilePermission ? (
        <span>Has file permission</span>
      ) : (
        <span>Does not have file permission</span>
      )}
    </div>
  )
}

describe('useFilePermissions', () => {
  beforeEach(() => {
    fileRepository.getAllByDatasetPersistentId = cy.stub().resolves([])
    fileRepository.getFilesCountInfoByDatasetPersistentId = cy
      .stub()
      .resolves(FilesCountInfoMother.create())
  })

  describe('Download permission', () => {
    it('should not call getFileUserPermissionsById when the file is not deaccessioned nor restricted nor embargoed', () => {
      const file = FilePreviewMother.createDefault()
      fileRepository.getUserPermissionsById = cy
        .stub()
        .resolves(FileUserPermissionsMother.create({ fileId: file.id }))

      cy.mount(
        <FilePermissionsProvider repository={fileRepository}>
          <TestComponent file={file} permission={FilePermission.DOWNLOAD_FILE} />
        </FilePermissionsProvider>
      )
      cy.wrap(fileRepository.getUserPermissionsById).should('not.be.called')
      cy.findByText('Has file permission').should('exist')
    })

    it('should call getFileUserPermissionsById when the file is deaccessioned', () => {
      const file = FilePreviewMother.createDeaccessioned()
      fileRepository.getUserPermissionsById = cy
        .stub()
        .resolves(FileUserPermissionsMother.create({ fileId: file.id, canEditDataset: true }))

      cy.mount(
        <FilePermissionsProvider repository={fileRepository}>
          <TestComponent file={file} permission={FilePermission.DOWNLOAD_FILE} />
        </FilePermissionsProvider>
      )

      cy.wrap(fileRepository.getUserPermissionsById).should('be.calledWith', file.id)
      cy.findByText('Has file permission').should('exist')
    })

    it('should call getFileUserPermissionsById when the file is restricted', () => {
      const file = FilePreviewMother.createWithRestrictedAccess()
      fileRepository.getUserPermissionsById = cy
        .stub()
        .resolves(FileUserPermissionsMother.create({ fileId: file.id, canDownloadFile: true }))
      cy.mount(
        <FilePermissionsProvider repository={fileRepository}>
          <TestComponent file={file} permission={FilePermission.DOWNLOAD_FILE} />
        </FilePermissionsProvider>
      )

      cy.wrap(fileRepository.getUserPermissionsById).should('be.calledWith', file.id)
      cy.findByText('Has file permission').should('exist')
    })

    it('should call getFileUserPermissionsById when the file is public but latest version is restricted', () => {
      const file = FilePreviewMother.createWithPublicAccessButLatestVersionRestricted()
      fileRepository.getUserPermissionsById = cy
        .stub()
        .resolves(FileUserPermissionsMother.create({ fileId: file.id, canDownloadFile: true }))
      cy.mount(
        <FilePermissionsProvider repository={fileRepository}>
          <TestComponent file={file} permission={FilePermission.DOWNLOAD_FILE} />
        </FilePermissionsProvider>
      )

      cy.wrap(fileRepository.getUserPermissionsById).should('be.calledWith', file.id)
      cy.findByText('Has file permission').should('exist')
    })

    it('should call getFileUserPermissionsById when the file is embargoed', () => {
      const file = FilePreviewMother.createWithEmbargo()
      fileRepository.getUserPermissionsById = cy
        .stub()
        .resolves(FileUserPermissionsMother.create({ fileId: file.id, canDownloadFile: true }))
      cy.mount(
        <FilePermissionsProvider repository={fileRepository}>
          <TestComponent file={file} permission={FilePermission.DOWNLOAD_FILE} />
        </FilePermissionsProvider>
      )

      cy.wrap(fileRepository.getUserPermissionsById).should('be.calledWith', file.id)
      cy.findByText('Has file permission').should('exist')
    })

    it('should return false if there is an error in the use case request', () => {
      const file = FilePreviewMother.createWithEmbargo()
      fileRepository.getUserPermissionsById = cy
        .stub()
        .rejects(new Error('There was an error getting the file user permissions'))
      cy.mount(
        <FilePermissionsProvider repository={fileRepository}>
          <TestComponent file={file} permission={FilePermission.DOWNLOAD_FILE} />
        </FilePermissionsProvider>
      )

      cy.wrap(fileRepository.getUserPermissionsById).should('be.calledWith', file.id)
      cy.findByText('Does not have file permission').should('exist')
    })

    it('should use the saved state of the permission the second time the file is being consulted', () => {
      const file = FilePreviewMother.createWithRestrictedAccess()
      fileRepository.getUserPermissionsById = cy
        .stub()
        .resolves(FileUserPermissionsMother.create({ fileId: file.id, canDownloadFile: true }))
      cy.mount(
        <FilePermissionsProvider repository={fileRepository}>
          <SavedPermissionsTestComponent file={file} permission={FilePermission.DOWNLOAD_FILE} />
        </FilePermissionsProvider>
      )

      cy.findAllByText('Has file permission').should('exist')
      cy.findAllByText('Has file permission again').should('exist')
      cy.wrap(fileRepository.getUserPermissionsById).should('be.calledOnce')
    })

    it('should always allow to download if the user is in anonymized view (privateUrl)', () => {
      const file = FilePreviewMother.createWithRestrictedAccess()
      fileRepository.getUserPermissionsById = cy
        .stub()
        .resolves(FileUserPermissionsMother.create({ fileId: file.id, canDownloadFile: false }))

      const anonymizedView = true
      const setAnonymizedView = () => {}
      cy.mount(
        <AnonymizedContext.Provider value={{ anonymizedView, setAnonymizedView }}>
          <FilePermissionsProvider repository={fileRepository}>
            <TestComponent file={file} permission={FilePermission.DOWNLOAD_FILE} />
          </FilePermissionsProvider>
        </AnonymizedContext.Provider>
      )

      cy.wrap(fileRepository.getUserPermissionsById).should('not.be.called')
      cy.findAllByText('Has file permission').should('exist')
    })
  })

  describe('Edit dataset permission', () => {
    it('should call getFileUserPermissionsById when asking for edit dataset permission', () => {
      const file = FilePreviewMother.createDefault()
      fileRepository.getUserPermissionsById = cy
        .stub()
        .resolves(FileUserPermissionsMother.create({ fileId: file.id, canEditDataset: true }))

      cy.mount(
        <FilePermissionsProvider repository={fileRepository}>
          <TestComponent file={file} permission={FilePermission.EDIT_DATASET} />
        </FilePermissionsProvider>
      )

      cy.wrap(fileRepository.getUserPermissionsById).should('be.calledWith', file.id)
      cy.findByText('Has file permission').should('exist')
    })

    it('should return false if there is an error in the use case request', () => {
      const file = FilePreviewMother.createDefault()
      fileRepository.getUserPermissionsById = cy
        .stub()
        .rejects(new Error('There was an error getting the file user permissions'))
      cy.mount(
        <FilePermissionsProvider repository={fileRepository}>
          <TestComponent file={file} permission={FilePermission.EDIT_DATASET} />
        </FilePermissionsProvider>
      )

      cy.wrap(fileRepository.getUserPermissionsById).should('be.calledWith', file.id)
      cy.findByText('Does not have file permission').should('exist')
    })

    it('should use the saved state of the edit dataset permission the second time the file is being consulted', () => {
      const file = FilePreviewMother.createDefault()
      fileRepository.getUserPermissionsById = cy
        .stub()
        .resolves(FileUserPermissionsMother.create({ fileId: file.id, canEditDataset: true }))
      cy.mount(
        <FilePermissionsProvider repository={fileRepository}>
          <SavedPermissionsTestComponent file={file} permission={FilePermission.EDIT_DATASET} />
        </FilePermissionsProvider>
      )

      cy.findAllByText('Has file permission').should('exist')
      cy.findAllByText('Has file permission again').should('exist')
      cy.wrap(fileRepository.getUserPermissionsById).should('be.calledOnce')
    })
  })
})
