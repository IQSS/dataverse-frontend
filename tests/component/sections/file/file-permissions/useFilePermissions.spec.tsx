import { useFilePermissions } from '../../../../../src/sections/file/file-permissions/FilePermissionsContext'
import { FilePermission } from '../../../../../src/files/domain/models/FileUserPermissions'
import { FileMother } from '../../../files/domain/models/FileMother'
import { useEffect, useState } from 'react'
import { FilePermissionsProvider } from '../../../../../src/sections/file/file-permissions/FilePermissionsProvider'
import { FileRepository } from '../../../../../src/files/domain/repositories/FileRepository'
import { File } from '../../../../../src/files/domain/models/File'
import { FileUserPermissionsMother } from '../../../files/domain/models/FileUserPermissionsMother'
import { FilesCountInfoMother } from '../../../files/domain/models/FilesCountInfoMother'
import { AnonymizedContext } from '../../../../../src/sections/dataset/anonymized/AnonymizedContext'

const fileRepository: FileRepository = {} as FileRepository
function DownloadFileTestComponent({ file }: { file: File }) {
  const { checkSessionUserHasFilePermission } = useFilePermissions()
  const [hasFileDownloadPermission, setHasFileDownloadPermission] = useState<boolean>(false)
  useEffect(() => {
    checkSessionUserHasFilePermission(FilePermission.DOWNLOAD_FILE, file)
      .then((hasPermission) => {
        setHasFileDownloadPermission(hasPermission)
      })
      .catch((error) => {
        console.error('There was an error getting the file download permission', error)
      })
  }, [file])

  return (
    <div>
      {hasFileDownloadPermission ? (
        <span>Has download permission</span>
      ) : (
        <span>Does not have download permission</span>
      )}
    </div>
  )
}

function EditDatasetTestComponent({ file }: { file: File }) {
  const { checkSessionUserHasFilePermission } = useFilePermissions()
  const [hasEditDatasetPermission, setHasEditDatasetPermission] = useState<boolean>(false)
  useEffect(() => {
    checkSessionUserHasFilePermission(FilePermission.EDIT_DATASET, file)
      .then((hasPermission) => {
        setHasEditDatasetPermission(hasPermission)
      })
      .catch((error) => {
        console.error('There was an error getting the edit dataset permission', error)
      })
  }, [file])

  return (
    <div>
      {hasEditDatasetPermission ? (
        <span>Has edit dataset permission</span>
      ) : (
        <span>Does not have edit dataset permission</span>
      )}
    </div>
  )
}

describe('useFilePermissions', () => {
  beforeEach(() => {
    fileRepository.getAllByDatasetPersistentId = cy.stub().resolves([])
    fileRepository.getCountInfoByDatasetPersistentId = cy
      .stub()
      .resolves(FilesCountInfoMother.create())
  })

  describe('Download permission', () => {
    it('should not call getFileUserPermissionsById when the file is not deaccessioned nor restricted nor embargoed', () => {
      const file = FileMother.createDefault()
      fileRepository.getFileUserPermissionsById = cy
        .stub()
        .resolves(FileUserPermissionsMother.create({ fileId: file.id }))

      cy.mount(
        <FilePermissionsProvider repository={fileRepository}>
          <DownloadFileTestComponent file={file} />
        </FilePermissionsProvider>
      )
      cy.wrap(fileRepository.getFileUserPermissionsById).should('not.be.called')
      cy.findByText('Has download permission').should('exist')
    })

    it('should call getFileUserPermissionsById when the file is deaccessioned', () => {
      const file = FileMother.createDeaccessioned()
      fileRepository.getFileUserPermissionsById = cy
        .stub()
        .resolves(FileUserPermissionsMother.create({ fileId: file.id, canEditDataset: true }))

      cy.mount(
        <FilePermissionsProvider repository={fileRepository}>
          <DownloadFileTestComponent file={file} />
        </FilePermissionsProvider>
      )

      cy.wrap(fileRepository.getFileUserPermissionsById).should('be.calledWith', file.id)
      cy.findByText('Has download permission').should('exist')
    })

    it('should call getFileUserPermissionsById when the file is restricted', () => {
      const file = FileMother.createWithRestrictedAccess()
      fileRepository.getFileUserPermissionsById = cy
        .stub()
        .resolves(FileUserPermissionsMother.create({ fileId: file.id, canDownloadFile: true }))
      cy.mount(
        <FilePermissionsProvider repository={fileRepository}>
          <DownloadFileTestComponent file={file} />
        </FilePermissionsProvider>
      )

      cy.wrap(fileRepository.getFileUserPermissionsById).should('be.calledWith', file.id)
      cy.findByText('Has download permission').should('exist')
    })

    it('should call getFileUserPermissionsById when the file is public but latest version is restricted', () => {
      const file = FileMother.createWithPublicAccessButLatestVersionRestricted()
      fileRepository.getFileUserPermissionsById = cy
        .stub()
        .resolves(FileUserPermissionsMother.create({ fileId: file.id, canDownloadFile: true }))
      cy.mount(
        <FilePermissionsProvider repository={fileRepository}>
          <DownloadFileTestComponent file={file} />
        </FilePermissionsProvider>
      )

      cy.wrap(fileRepository.getFileUserPermissionsById).should('be.calledWith', file.id)
      cy.findByText('Has download permission').should('exist')
    })

    it('should call getFileUserPermissionsById when the file is embargoed', () => {
      const file = FileMother.createWithEmbargo()
      fileRepository.getFileUserPermissionsById = cy
        .stub()
        .resolves(FileUserPermissionsMother.create({ fileId: file.id, canDownloadFile: true }))
      cy.mount(
        <FilePermissionsProvider repository={fileRepository}>
          <DownloadFileTestComponent file={file} />
        </FilePermissionsProvider>
      )

      cy.wrap(fileRepository.getFileUserPermissionsById).should('be.calledWith', file.id)
      cy.findByText('Has download permission').should('exist')
    })

    it('should return false if there is an error in the use case request', () => {
      const file = FileMother.createWithEmbargo()
      fileRepository.getFileUserPermissionsById = cy
        .stub()
        .rejects(new Error('There was an error getting the file user permissions'))
      cy.mount(
        <FilePermissionsProvider repository={fileRepository}>
          <DownloadFileTestComponent file={file} />
        </FilePermissionsProvider>
      )

      cy.wrap(fileRepository.getFileUserPermissionsById).should('be.calledWith', file.id)
      cy.findByText('Does not have download permission').should('exist')
    })

    it.skip('should use the cached state canDownloadPermissionByFileId the second time the file is being consulted', () => {
      // TODO - Implement cache
      const file = FileMother.createWithRestrictedAccess()
      fileRepository.getFileUserPermissionsById = cy
        .stub()
        .resolves(FileUserPermissionsMother.create({ fileId: file.id, canDownloadFile: true }))
      cy.mount(
        <FilePermissionsProvider repository={fileRepository}>
          <DownloadFileTestComponent file={file} />
          <DownloadFileTestComponent file={file} />
        </FilePermissionsProvider>
      )

      cy.findAllByText('Has download permission').should('exist')
      cy.wrap(fileRepository.getFileUserPermissionsById).should('be.calledOnce')
    })

    it('should always allow to download if the user is in anonymized view (privateUrl)', () => {
      const file = FileMother.createWithRestrictedAccess()
      fileRepository.getFileUserPermissionsById = cy
        .stub()
        .resolves(FileUserPermissionsMother.create({ fileId: file.id, canDownloadFile: false }))

      const anonymizedView = true
      const setAnonymizedView = () => {}
      cy.mount(
        <AnonymizedContext.Provider value={{ anonymizedView, setAnonymizedView }}>
          <FilePermissionsProvider repository={fileRepository}>
            <DownloadFileTestComponent file={file} />
            <DownloadFileTestComponent file={file} />
          </FilePermissionsProvider>
        </AnonymizedContext.Provider>
      )

      cy.wrap(fileRepository.getFileUserPermissionsById).should('not.be.called')
      cy.findAllByText('Has download permission').should('exist')
    })
  })

  describe('Edit dataset permission', () => {
    it('should call getFileUserPermissionsById when asking for edit dataset permission', () => {
      const file = FileMother.createDefault()
      fileRepository.getFileUserPermissionsById = cy
        .stub()
        .resolves(FileUserPermissionsMother.create({ fileId: file.id, canEditDataset: true }))

      cy.mount(
        <FilePermissionsProvider repository={fileRepository}>
          <EditDatasetTestComponent file={file} />
        </FilePermissionsProvider>
      )

      cy.wrap(fileRepository.getFileUserPermissionsById).should('be.calledWith', file.id)
      cy.findByText('Has edit dataset permission').should('exist')
    })

    it('should return false if there is an error in the use case request', () => {
      const file = FileMother.createDefault()
      fileRepository.getFileUserPermissionsById = cy
        .stub()
        .rejects(new Error('There was an error getting the file user permissions'))
      cy.mount(
        <FilePermissionsProvider repository={fileRepository}>
          <EditDatasetTestComponent file={file} />
        </FilePermissionsProvider>
      )

      cy.wrap(fileRepository.getFileUserPermissionsById).should('be.calledWith', file.id)
      cy.findByText('Does not have edit dataset permission').should('exist')
    })
  })
})
