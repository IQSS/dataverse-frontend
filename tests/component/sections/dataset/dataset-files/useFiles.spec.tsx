import { FilesCountInfoMother } from '../../../files/domain/models/FilesCountInfoMother'
import { FileRepository } from '../../../../../src/files/domain/repositories/FileRepository'
import { useFiles } from '../../../../../src/sections/dataset/dataset-files/useFiles'
import { useState } from 'react'
import { FilePaginationInfo } from '../../../../../src/files/domain/models/FilePaginationInfo'
import { FileCriteria, FileSortByOption } from '../../../../../src/files/domain/models/FileCriteria'
import { DatasetVersionMother } from '../../../dataset/domain/models/DatasetMother'
import { FilePreviewMother } from '../../../files/domain/models/FilePreviewMother'

const files = FilePreviewMother.createMany(100)
const filesCountInfo = FilesCountInfoMother.create({ total: 100 })
const fileRepository: FileRepository = {} as FileRepository
const datasetVersion = DatasetVersionMother.createReleased()

const FilesTableTestComponent = ({ datasetPersistentId }: { datasetPersistentId: string }) => {
  const [paginationInfo, setPaginationInfo] = useState<FilePaginationInfo>(new FilePaginationInfo())
  const [criteria, setCriteria] = useState<FileCriteria>(new FileCriteria())
  const { isLoading, files, filesTotalDownloadSize } = useFiles(
    fileRepository,
    datasetPersistentId,
    datasetVersion,
    setPaginationInfo,
    paginationInfo,
    criteria
  )

  if (isLoading) {
    return <span>Loading...</span>
  }
  return (
    <>
      <button
        onClick={() => {
          setCriteria(criteria.withSortBy(FileSortByOption.NAME_ZA))
        }}>
        Sort by name Z-A
      </button>
      <div>Files count: {paginationInfo.totalItems}</div>
      <div>Files total download size: {filesTotalDownloadSize}</div>
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
    fileRepository.getFilesCountInfoByDatasetPersistentId = cy.stub().resolves(filesCountInfo)
    fileRepository.getFilesTotalDownloadSizeByDatasetPersistentId = cy.stub().resolves(100)
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
    cy.wrap(fileRepository.getFilesCountInfoByDatasetPersistentId).should(
      'be.calledOnceWith',
      'persistentId'
    )
    cy.wrap(fileRepository.getAllByDatasetPersistentId).should(
      'be.calledOnceWith',
      'persistentId',
      datasetVersion,
      new FilePaginationInfo(1, 10, 100),
      new FileCriteria()
    )

    cy.findByText('Files count: 100').should('exist')
  })

  it('calls the file repository to get the files only if files count info is greater than 0', () => {
    fileRepository.getFilesCountInfoByDatasetPersistentId = cy
      .stub()
      .resolves(FilesCountInfoMother.create({ total: 0 }))

    cy.customMount(<FilesTableTestComponent datasetPersistentId="persistentId" />)

    cy.findByText('Loading...').should('exist')
    cy.wrap(fileRepository.getAllByDatasetPersistentId).should('not.be.called')
  })

  it('calls the file repository to get the files total download size', () => {
    cy.customMount(<FilesTableTestComponent datasetPersistentId="persistentId" />)

    cy.findByText('Files total download size: 100').should('exist')
    cy.wrap(fileRepository.getFilesTotalDownloadSizeByDatasetPersistentId).should(
      'be.calledOnceWith',
      'persistentId'
    )
  })

  it('calls the file repository to get the files total count on file criteria change', () => {
    cy.customMount(<FilesTableTestComponent datasetPersistentId="persistentId" />)

    cy.findByText('Files count: 100').should('exist')
    cy.wrap(fileRepository.getFilesCountInfoByDatasetPersistentId).should(
      'be.calledOnceWith',
      'persistentId',
      datasetVersion.number,
      new FileCriteria()
    )

    cy.findByText('Sort by name Z-A').click()

    cy.findByText('Files count: 100').should('exist')
    cy.wrap(fileRepository.getFilesCountInfoByDatasetPersistentId).should(
      'be.calledWith',
      'persistentId',
      datasetVersion.number,
      new FileCriteria().withSortBy(FileSortByOption.NAME_ZA)
    )
  })
})
