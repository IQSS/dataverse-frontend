import { FileMetadataMother } from '../../../files/domain/models/FileMetadataMother'
import { FileRepository } from '../../../../../src/files/domain/repositories/FileRepository'
import {
  FileAccessOption,
  FileCriteria,
  FileSortByOption,
  FileTag
} from '../../../../../src/files/domain/models/FileCriteria'
import { FilesCountInfoMother } from '../../../files/domain/models/FilesCountInfoMother'
import {
  FileSize,
  FileSizeUnit,
  FileType
} from '../../../../../src/files/domain/models/FileMetadata'
import styles from '../../../../../src/sections/dataset/dataset-files/files-table/FilesTable.module.scss'
import { DatasetMother } from '../../../dataset/domain/models/DatasetMother'
import { SettingMother } from '../../../settings/domain/models/SettingMother'
import { ZipDownloadLimit } from '../../../../../src/settings/domain/models/ZipDownloadLimit'
import { SettingsProvider } from '../../../../../src/sections/settings/SettingsProvider'
import { SettingRepository } from '../../../../../src/settings/domain/repositories/SettingRepository'
import { FilePaginationInfo } from '../../../../../src/files/domain/models/FilePaginationInfo'
import { FilePreviewMother } from '../../../files/domain/models/FilePreviewMother'
// import { FilePreview } from '../../../../../src/files/domain/models/FilePreview'
import { DatasetFilesScrollable } from '../../../../../src/sections/dataset/dataset-files/DatasetFilesScrollable'
import { FilesWithCount } from '../../../../../src/files/domain/models/FilesWithCount'

const TOTAL_FILES_COUNT = 200
const ONLY_4_FILES_COUNT = 4
const allFiles = FilePreviewMother.createMany(TOTAL_FILES_COUNT)
const first10Files = allFiles.slice(0, 10)

const testFiles: FilesWithCount = {
  files: first10Files,
  totalFilesCount: TOTAL_FILES_COUNT
}

const only4Files: FilesWithCount = {
  files: allFiles.slice(0, ONLY_4_FILES_COUNT),
  totalFilesCount: ONLY_4_FILES_COUNT
}

const datasetPersistentId = 'test-dataset-persistent-id'
const datasetVersion = DatasetMother.create().version
const fileRepository: FileRepository = {} as FileRepository
const testFilesCountInfo = FilesCountInfoMother.create({
  total: 200,
  perFileType: [
    {
      type: new FileType('text/plain'),
      count: 5
    },
    {
      type: new FileType('image/png'),
      count: 485
    }
  ],
  perAccess: [
    { access: FileAccessOption.PUBLIC, count: 222 },
    { access: FileAccessOption.RESTRICTED, count: 10 }
  ],
  perFileTag: [
    { tag: new FileTag('document'), count: 5 },
    { tag: new FileTag('code'), count: 10 }
  ]
})
const paginationInfo: FilePaginationInfo = new FilePaginationInfo(1, 10, 200)
const settingsRepository = {} as SettingRepository

describe('DatasetFilesScrollable', () => {
  beforeEach(() => {
    fileRepository.getAllByDatasetPersistentIdWithCount = cy.stub().resolves(testFiles)
    fileRepository.getFilesCountInfoByDatasetPersistentId = cy.stub().resolves(testFilesCountInfo)
    fileRepository.getFilesTotalDownloadSizeByDatasetPersistentId = cy.stub().resolves(19900)

    settingsRepository.getByName = cy
      .stub()
      .resolves(SettingMother.createZipDownloadLimit(new ZipDownloadLimit(1, FileSizeUnit.BYTES)))
  })

  it('renders the scrollable files table', () => {
    cy.customMount(
      <DatasetFilesScrollable
        filesRepository={fileRepository}
        datasetPersistentId={datasetPersistentId}
        datasetVersion={datasetVersion}
      />
    )

    cy.findByRole('table').should('exist')
    cy.findByRole('columnheader', { name: /Files/ }).should('exist')
  })

  it('renders the first 10 files', () => {
    cy.customMount(
      <DatasetFilesScrollable
        filesRepository={fileRepository}
        datasetPersistentId={datasetPersistentId}
        datasetVersion={datasetVersion}
      />
    )

    cy.findByText('10 of 200 Files seen').should('exist')
    first10Files.forEach((file) => {
      cy.findByText(file.name).should('exist').should('have.attr', 'href', `/files?id=${file.id}`)
    })
  })

  it('renders 4 files with no more to load, correct results in header, and no bottom skeleton loader', () => {
    fileRepository.getAllByDatasetPersistentIdWithCount = cy.stub().resolves(only4Files)

    cy.customMount(
      <DatasetFilesScrollable
        filesRepository={fileRepository}
        datasetPersistentId={datasetPersistentId}
        datasetVersion={datasetVersion}
      />
    )

    cy.findByText(`${ONLY_4_FILES_COUNT} Files`).should('exist')
    only4Files.files.forEach((file) => {
      cy.findByText(file.name).should('exist').should('have.attr', 'href', `/files?id=${file.id}`)
    })
    cy.findByTestId('table-row-loading-skeleton').should('not.exist')
  })

  it('loads more files when scrolling to the bottom ', () => {
    cy.customMount(
      <DatasetFilesScrollable
        filesRepository={fileRepository}
        datasetPersistentId={datasetPersistentId}
        datasetVersion={datasetVersion}
      />
    )

    cy.findByText('10 of 200 Files seen').should('exist')

    cy.findByTestId('scrollable-files-container').as('scrollableFilesContainer')
    cy.get('@scrollableFilesContainer').scrollTo('bottom')

    cy.findByText('20 of 200 Files seen').should('exist')

    cy.get('@scrollableFilesContainer').scrollTo('bottom')

    cy.findByText('30 of 200 Files seen').should('exist')
  })

  it('scrolls to the top when criteria changes', () => {
    cy.customMount(
      <DatasetFilesScrollable
        filesRepository={fileRepository}
        datasetPersistentId={datasetPersistentId}
        datasetVersion={datasetVersion}
      />
    )

    cy.findByText('10 of 200 Files seen').should('exist')
    cy.findByTestId('scrollable-files-container').as('scrollableFilesContainer')
    cy.get('@scrollableFilesContainer').scrollTo('bottom')

    cy.findByText('20 of 200 Files seen').should('exist')

    cy.findByRole('button', { name: /Sort/ }).click()
    cy.findByText('Name (Z-A)').should('exist').click()

    cy.get('@scrollableFilesContainer').then(($el) => {
      expect($el[0].scrollTop).to.equal(0)
    })
  })

  describe('Error handling', () => {
    it('shows error banner if there is an error getting files', () => {
      fileRepository.getAllByDatasetPersistentIdWithCount = cy
        .stub()
        .rejects(new Error('Some error on getAllByDatasetPersistentIdWithCount'))

      cy.customMount(
        <DatasetFilesScrollable
          filesRepository={fileRepository}
          datasetPersistentId={datasetPersistentId}
          datasetVersion={datasetVersion}
        />
      )
      cy.findByText('Error').should('exist')
    })

    it('shows fallback error message if there is an unknown error getting files', () => {
      fileRepository.getAllByDatasetPersistentIdWithCount = cy.stub().rejects(new Error())

      cy.customMount(
        <DatasetFilesScrollable
          filesRepository={fileRepository}
          datasetPersistentId={datasetPersistentId}
          datasetVersion={datasetVersion}
        />
      )
      cy.findByText(/There was an error getting the files total download size/).should('exist')
    })

    it('shows error banner if there is an error getting total download size', () => {
      fileRepository.getFilesTotalDownloadSizeByDatasetPersistentId = cy
        .stub()
        .rejects(new Error('Some error on getFilesTotalDownloadSizeByDatasetPersistentId'))

      cy.customMount(
        <DatasetFilesScrollable
          filesRepository={fileRepository}
          datasetPersistentId={datasetPersistentId}
          datasetVersion={datasetVersion}
        />
      )
      cy.findByText('Error').should('exist')
    })

    it('shows fallback error message if there is an unknown error getting total download size', () => {
      fileRepository.getFilesTotalDownloadSizeByDatasetPersistentId = cy.stub().rejects(new Error())

      cy.customMount(
        <DatasetFilesScrollable
          filesRepository={fileRepository}
          datasetPersistentId={datasetPersistentId}
          datasetVersion={datasetVersion}
        />
      )
      cy.findByText(/There was an error getting the files total download size/).should('exist')
    })

    it('shows error banner if there is an error getting files info count', () => {
      fileRepository.getFilesCountInfoByDatasetPersistentId = cy
        .stub()
        .rejects(new Error('Some error on getFilesCountInfoByDatasetPersistentId'))

      cy.customMount(
        <DatasetFilesScrollable
          filesRepository={fileRepository}
          datasetPersistentId={datasetPersistentId}
          datasetVersion={datasetVersion}
        />
      )
      cy.findByText('Error').should('exist')
    })

    it('shows fallback error message if there is an unknown error getting files info count', () => {
      fileRepository.getFilesCountInfoByDatasetPersistentId = cy.stub().rejects(new Error())

      cy.customMount(
        <DatasetFilesScrollable
          filesRepository={fileRepository}
          datasetPersistentId={datasetPersistentId}
          datasetVersion={datasetVersion}
        />
      )
      cy.findByText(/There was an error getting the files count info/).should('exist')
    })
  })

  //TODO:ME Maybe add this test in the FilesTableScrollable.spec.tsx file?
  //   it('renders skeleton while loading', () => {
  //     cy.customMount(
  //       <DatasetFilesScrollable
  //         filesRepository={fileRepository}
  //         datasetPersistentId={datasetPersistentId}
  //         datasetVersion={datasetVersion}
  //       />
  //     )

  //     cy.findByTestId('table-row-loading-skeleton').should('exist')
  //   })

  describe('File selection', () => {
    it('maintains the selection when scrolling to bottom and loading more files', () => {
      cy.customMount(
        <DatasetFilesScrollable
          filesRepository={fileRepository}
          datasetPersistentId={datasetPersistentId}
          datasetVersion={datasetVersion}
        />
      )
      cy.findByRole('columnheader', { name: '10 of 200 Files seen' }).should('exist')
      cy.get('table > tbody > tr:nth-child(2) > td:nth-child(1) > input[type=checkbox]').click()
      cy.get('table > tbody > tr:nth-child(2)').should('have.class', styles['selected-row'])
      cy.findByText('1 file is currently selected.').should('exist')

      cy.findByTestId('scrollable-files-container').as('scrollableFilesContainer')
      cy.get('@scrollableFilesContainer').scrollTo('bottom')

      cy.findByRole('columnheader', { name: '20 of 200 Files seen' }).should('exist')

      cy.get('table > tbody > tr:nth-child(2)').should('have.class', styles['selected-row'])
      cy.findByText('1 file is currently selected.').should('exist')
      //   cy.get('table > tbody > tr:nth-child(3) > td:nth-child(1) > input[type=checkbox]').click()
      //   cy.get('table > tbody > tr:nth-child(3)').should('have.class', styles['selected-row'])
      //   cy.findByText('2 files are currently selected.').should('exist')
    })

    it('removes the selection when the filters change', () => {
      cy.customMount(
        <DatasetFilesScrollable
          filesRepository={fileRepository}
          datasetPersistentId={datasetPersistentId}
          datasetVersion={datasetVersion}
        />
      )
      cy.findByRole('columnheader', { name: '10 of 200 Files seen' }).should('exist')
      cy.get('table > tbody > tr:nth-child(2) > td:nth-child(1) > input[type=checkbox]').click()
      cy.findByText('1 file is currently selected.').should('exist')
      cy.findByRole('button', { name: 'File Type: All' }).click()
      cy.findByText('PNG Image (485)').should('exist').click()
      cy.findByText('1 file is currently selected.').should('not.exist')
    })

    it('removes the selection when the Sort by changes', () => {
      cy.customMount(
        <DatasetFilesScrollable
          filesRepository={fileRepository}
          datasetPersistentId={datasetPersistentId}
          datasetVersion={datasetVersion}
        />
      )
      cy.findByRole('columnheader', { name: '10 of 200 Files seen' }).should('exist')
      cy.get('table > tbody > tr:nth-child(2) > td:nth-child(1) > input[type=checkbox]').click()
      cy.findByText('1 file is currently selected.').should('exist')
      cy.findByRole('button', { name: /Sort/ }).click()
      cy.findByText('Name (Z-A)').should('exist').click()
      cy.findByText('1 file is currently selected.').should('not.exist')
    })

    it('removes the selection when the Search bar is used', () => {
      cy.customMount(
        <DatasetFilesScrollable
          filesRepository={fileRepository}
          datasetPersistentId={datasetPersistentId}
          datasetVersion={datasetVersion}
        />
      )
      cy.findByRole('columnheader', { name: '10 of 200 Files seen' }).should('exist')
      cy.get('table > tbody > tr:nth-child(2) > td:nth-child(1) > input[type=checkbox]').click()
      cy.findByText('1 file is currently selected.').should('exist')
      cy.findByLabelText('Search').type('test{enter}')
      cy.findByText('1 file is currently selected.').should('not.exist')
    })

    it('renders the zip download limit message when selecting rows from different scroll loadings', () => {
      testFiles.files[1] = FilePreviewMother.create({
        metadata: FileMetadataMother.create({
          size: new FileSize(1, FileSizeUnit.BYTES)
        })
      })
      testFiles.files[2] = FilePreviewMother.create({
        metadata: FileMetadataMother.create({ size: new FileSize(2, FileSizeUnit.BYTES) })
      })
      cy.customMount(
        <SettingsProvider repository={settingsRepository}>
          <DatasetFilesScrollable
            filesRepository={fileRepository}
            datasetPersistentId={datasetPersistentId}
            datasetVersion={datasetVersion}
          />
        </SettingsProvider>
      )
      cy.get('table > tbody > tr:nth-child(2) > td:nth-child(1) > input[type=checkbox]').click()

      cy.findByTestId('scrollable-files-container').as('scrollableFilesContainer')
      cy.get('@scrollableFilesContainer').scrollTo('bottom')

      cy.get('table > tbody > tr:nth-child(3) > td:nth-child(1) > input[type=checkbox]').click()
      cy.findByText(
        'The overall size of the files selected (3.0 B) for download exceeds the zip limit of 1.0 B. Please unselect some files to continue.'
      ).should('exist')
      cy.get('table > tbody > tr:nth-child(3) > td:nth-child(1) > input[type=checkbox]').click()
      cy.findByText(
        /exceeds the zip limit of 1.0 B. Please unselect some files to continue./
      ).should('not.exist')
    })

    it('renders the zip download limit message when selecting all rows', () => {
      cy.customMount(
        <SettingsProvider repository={settingsRepository}>
          <DatasetFilesScrollable
            filesRepository={fileRepository}
            datasetPersistentId={datasetPersistentId}
            datasetVersion={datasetVersion}
          />
        </SettingsProvider>
      )
      cy.get('table > thead > tr > th > input[type=checkbox]').click()
      cy.findByRole('button', { name: 'Select all 200 files in this dataset.' }).click()
      cy.findByText(
        'The overall size of the files selected (19.4 KB) for download exceeds the zip limit of 1.0 B. Please unselect some files to continue.'
      ).should('exist')
    })

    it('renders the zip download limit message when selecting all rows and then scrolling to bottom to load more files', () => {
      cy.customMount(
        <SettingsProvider repository={settingsRepository}>
          <DatasetFilesScrollable
            filesRepository={fileRepository}
            datasetPersistentId={datasetPersistentId}
            datasetVersion={datasetVersion}
          />
        </SettingsProvider>
      )
      cy.get('table > thead > tr > th > input[type=checkbox]').click()
      cy.findByRole('button', { name: 'Select all 200 files in this dataset.' }).click()

      cy.findByTestId('scrollable-files-container').as('scrollableFilesContainer')
      cy.get('@scrollableFilesContainer').scrollTo('bottom')

      cy.findByText(
        'The overall size of the files selected (19.4 KB) for download exceeds the zip limit of 1.0 B. Please unselect some files to continue.'
      ).should('exist')
    })
  })
  describe('Calling use cases', () => {
    it('calls the useGetAccumulatedFiles hook with the correct parameters', () => {
      cy.customMount(
        <DatasetFilesScrollable
          filesRepository={fileRepository}
          datasetPersistentId={datasetPersistentId}
          datasetVersion={datasetVersion}
        />
      )
      cy.wrap(fileRepository.getAllByDatasetPersistentIdWithCount).should(
        'be.calledWith',
        datasetPersistentId,
        datasetVersion
      )
      cy.wrap(fileRepository.getFilesCountInfoByDatasetPersistentId).should(
        'be.calledWith',
        datasetPersistentId,
        datasetVersion.number
      )
    })
    it('calls the useGetAccumulatedFiles hook with the correct parameters when sortBy criteria changes', () => {
      cy.customMount(
        <DatasetFilesScrollable
          filesRepository={fileRepository}
          datasetPersistentId={datasetPersistentId}
          datasetVersion={datasetVersion}
        />
      )
      cy.findByRole('button', { name: /Sort/ }).click()
      cy.findByText('Name (Z-A)').should('exist').click()
      cy.wrap(fileRepository.getAllByDatasetPersistentIdWithCount).should(
        'be.calledWith',
        datasetPersistentId,
        datasetVersion,
        new FilePaginationInfo(1, 10, 0),
        new FileCriteria().withSortBy(FileSortByOption.NAME_ZA)
      )
    })
    it('calls the useGetAccumulatedFiles hook with the correct parameters when filterByType criteria changes', () => {
      cy.customMount(
        <DatasetFilesScrollable
          filesRepository={fileRepository}
          datasetPersistentId={datasetPersistentId}
          datasetVersion={datasetVersion}
        />
      )
      cy.findByRole('button', { name: 'File Type: All' }).click()
      cy.findByText('PNG Image (485)').should('exist').click()
      cy.wrap(fileRepository.getAllByDatasetPersistentIdWithCount).should(
        'be.calledWith',
        datasetPersistentId,
        datasetVersion,
        new FilePaginationInfo(1, 10, 0),
        new FileCriteria().withFilterByType('image/png')
      )
    })
    it('calls the useGetAccumulatedFiles hook with the correct parameters when filterByAccess criteria changes', () => {
      cy.customMount(
        <DatasetFilesScrollable
          filesRepository={fileRepository}
          datasetPersistentId={datasetPersistentId}
          datasetVersion={datasetVersion}
        />
      )
      cy.findByRole('button', { name: 'Access: All' }).click()
      cy.findByText('Public (222)').should('exist').click()
      cy.wrap(fileRepository.getAllByDatasetPersistentIdWithCount).should(
        'be.calledWith',
        datasetPersistentId,
        datasetVersion,
        new FilePaginationInfo(1, 10, 0),
        new FileCriteria().withFilterByAccess(FileAccessOption.PUBLIC)
      )
    })
    it('calls the useGetAccumulatedFiles hook with the correct parameters when filterByTag criteria changes', () => {
      cy.customMount(
        <DatasetFilesScrollable
          filesRepository={fileRepository}
          datasetPersistentId={datasetPersistentId}
          datasetVersion={datasetVersion}
        />
      )
      cy.findByRole('button', { name: 'File Tags: All' }).click()
      cy.findByText('Document (5)').should('exist').click()
      cy.wrap(fileRepository.getAllByDatasetPersistentIdWithCount).should(
        'be.calledWith',
        datasetPersistentId,
        datasetVersion,
        new FilePaginationInfo(1, 10, 0),
        new FileCriteria().withFilterByTag('document')
      )
    })
    it('calls the useGetAccumulatedFiles hook with the correct parameters when searchText criteria changes', () => {
      cy.customMount(
        <DatasetFilesScrollable
          filesRepository={fileRepository}
          datasetPersistentId={datasetPersistentId}
          datasetVersion={datasetVersion}
        />
      )
      cy.findByLabelText('Search').type('test{enter}')
      cy.wrap(fileRepository.getAllByDatasetPersistentIdWithCount).should(
        'be.calledWith',
        datasetPersistentId,
        datasetVersion,
        new FilePaginationInfo(1, 10, 0),
        new FileCriteria().withSearchText('test')
      )
    })
    it.only('calls the useGetAccumulatedFiles hook with the correct parameters when scrolling to bottom', () => {
      cy.customMount(
        <DatasetFilesScrollable
          filesRepository={fileRepository}
          datasetPersistentId={datasetPersistentId}
          datasetVersion={datasetVersion}
        />
      )

      cy.wrap(fileRepository.getAllByDatasetPersistentIdWithCount).should(
        'be.calledWith',
        datasetPersistentId,
        datasetVersion,
        new FilePaginationInfo(1, 10, 0),
        new FileCriteria()
      )

      cy.wait(1_000)

      cy.findByTestId('scrollable-files-container').as('scrollableFilesContainer')
      cy.get('@scrollableFilesContainer').scrollTo('bottom')

      cy.wrap(fileRepository.getAllByDatasetPersistentIdWithCount).should(
        'be.calledWith',
        datasetPersistentId,
        datasetVersion,
        new FilePaginationInfo(2, 10, 200),
        new FileCriteria().withSortBy(FileSortByOption.NAME_AZ)
      )
    })
    //     it('calls getFilesTotalDownloadSizeByDatasetPersistentId with the correct parameters when applying search file criteria', () => {
    //       cy.customMount(
    //         <SettingsProvider repository={settingsRepository}>
    //           <DatasetFiles
    //             filesRepository={fileRepository}
    //             datasetPersistentId={datasetPersistentId}
    //             datasetVersion={datasetVersion}
    //           />
    //         </SettingsProvider>
    //       )
    //       cy.findByRole('button', { name: 'File Type: All' }).click()
    //       cy.findByText('PNG Image (485)').should('exist').click()
    //       cy.get('table > thead > tr > th > input[type=checkbox]').click()
    //       cy.findByRole('button', { name: 'Select all 200 files in this dataset.' }).click()
    //       cy.findByText(
    //         'The overall size of the files selected (19.4 KB) for download exceeds the zip limit of 1.0 B. Please unselect some files to continue.'
    //       ).should('exist')
    //       cy.wrap(fileRepository.getFilesTotalDownloadSizeByDatasetPersistentId).should(
    //         'be.calledWith',
    //         datasetPersistentId,
    //         datasetVersion.number,
    //         new FileCriteria().withFilterByType('image/png')
    //       )
    //     })
  })
})
