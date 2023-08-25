import { FilesCountInfoMother } from '../../../files/domain/models/FilesCountInfoMother'
import { FileMother } from '../../../files/domain/models/FileMother'
import { FileRepository } from '../../../../../src/files/domain/repositories/FileRepository'
import { useFiles } from '../../../../../src/sections/dataset/dataset-files/useFiles'
import { FileUserPermissionsMother } from '../../../files/domain/models/FileUserPermissionsMother'
import { FilePermissionsProvider } from '../../../../../src/sections/file/file-permissions/FilePermissionsProvider'
import { DatasetMother } from '../../../dataset/domain/models/DatasetMother'

const files = FileMother.createMany(100)
const filesCountInfo = FilesCountInfoMother.create({ total: 100 })
const fileRepository: FileRepository = {} as FileRepository
const datasetVersion = DatasetMother.create().version

const FilesTableTestComponent = ({ datasetPersistentId }: { datasetPersistentId: string }) => {
  const { isLoading, files, filesCountInfo } = useFiles(
    fileRepository,
    datasetPersistentId,
    datasetVersion
  )
  if (isLoading) {
    return <span>Loading...</span>
  }
  return (
    <>
      <div>Files count: {filesCountInfo.total}</div>
      <table>
        <tbody>
          {files.map((file) => (
            <tr key={file.id}>
              <td>{file.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

describe('useFiles', () => {
  beforeEach(() => {
    fileRepository.getAllByDatasetPersistentId = cy.stub().resolves(files)
    fileRepository.getCountInfoByDatasetPersistentId = cy.stub().resolves(filesCountInfo)
    fileRepository.getFileUserPermissionsById = cy
      .stub()
      .resolves(FileUserPermissionsMother.create({ fileId: files[0].id }))
  })

  it('returns the files', () => {
    cy.customMount(<FilesTableTestComponent datasetPersistentId="persistentId" />)

    cy.findByText('Loading...').should('exist')
    cy.findByText('Loading...').should('not.exist')

    cy.findAllByRole('row').should('have.length', 100)
    cy.findByText(files[0].name).should('exist')
    cy.findByText(files[99].name).should('exist')
  })

  it('returns the files count info', () => {
    cy.customMount(<FilesTableTestComponent datasetPersistentId="persistentId" />)

    cy.findByText('Loading...').should('exist')
    cy.findByText('Files count: 100').should('exist')
    cy.findByText('Loading...').should('not.exist')
  })

  it('calls the file repository', () => {
    cy.customMount(<FilesTableTestComponent datasetPersistentId="persistentId" />)

    cy.findByText('Loading...').should('exist')
    cy.wrap(fileRepository.getAllByDatasetPersistentId).should('be.calledOnceWith', 'persistentId')

    cy.findByText('Loading...').should('exist')
    cy.wrap(fileRepository.getCountInfoByDatasetPersistentId).should(
      'be.calledOnceWith',
      'persistentId'
    )

    cy.findByText('Loading...').should('exist')
    cy.findByText('Files count: 100').should('exist')
  })

  it('calls the file repository to get the permissions before removing the loading', () => {
    cy.customMount(
      <FilePermissionsProvider repository={fileRepository}>
        <FilesTableTestComponent datasetPersistentId="persistentId" />
      </FilePermissionsProvider>
    )

    cy.findByText('Loading...').should('exist')
    cy.wrap(fileRepository.getAllByDatasetPersistentId).should('be.calledOnceWith', 'persistentId')

    cy.findByText('Loading...').should('exist')
    cy.wrap(fileRepository.getFileUserPermissionsById).should('be.calledWith', files[0].id)

    cy.findByText('Loading...').should('exist')
    cy.findByText('Files count: 100').should('exist')
  })
})
