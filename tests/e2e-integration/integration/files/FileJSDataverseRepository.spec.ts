import { TestsUtils } from '../../shared/TestsUtils'
import { FileJSDataverseRepository } from '../../../../src/files/infrastructure/FileJSDataverseRepository'
import {
  FileDateType,
  FileEmbargo,
  FileLabelType,
  FileMetadata,
  FileSize,
  FileSizeUnit,
  FileType
} from '../../../../src/files/domain/models/FileMetadata'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { DatasetJSDataverseRepository } from '../../../../src/dataset/infrastructure/repositories/DatasetJSDataverseRepository'
import {
  FileAccessOption,
  FileCriteria,
  FileSortByOption,
  FileTag
} from '../../../../src/files/domain/models/FileCriteria'
import { DatasetHelper } from '../../shared/datasets/DatasetHelper'
import { FileData, FileHelper } from '../../shared/files/FileHelper'
import { FilesCountInfo } from '../../../../src/files/domain/models/FilesCountInfo'
import { DatasetVersionMother } from '../../../component/dataset/domain/models/DatasetMother'
import { FilePaginationInfo } from '../../../../src/files/domain/models/FilePaginationInfo'
import { FilePreview } from '../../../../src/files/domain/models/FilePreview'
import { DatasetPublishingStatus } from '../../../../src/dataset/domain/models/Dataset'
import { File } from '../../../../src/files/domain/models/File'
import { FileIngest, FileIngestStatus } from '../../../../src/files/domain/models/FileIngest'

chai.use(chaiAsPromised)
const expect = chai.expect

const fileRepository = new FileJSDataverseRepository()
const datasetRepository = new DatasetJSDataverseRepository()
const dateNow = new Date()
dateNow.setHours(2, 0, 0, 0)
const filePreviewExpectedData = (id: number): FilePreview => {
  return {
    id: id,
    name: 'blob',
    datasetPublishingStatus: DatasetPublishingStatus.DRAFT,
    access: {
      restricted: false,
      latestVersionRestricted: false,
      canBeRequested: false,
      requested: false
    },
    ingest: new FileIngest(FileIngestStatus.NONE),
    metadata: {
      type: new FileType('text/plain'),
      size: new FileSize(25, FileSizeUnit.BYTES),
      date: {
        type: FileDateType.DEPOSITED,
        date: dateNow
      },
      downloadCount: 0,
      labels: [],
      isDeleted: false,
      downloadUrls: {
        original: `/api/access/datafile/${id}?format=original`,
        tabular: `/api/access/datafile/${id}`,
        rData: `/api/access/datafile/${id}?format=RData`
      },
      depositDate: dateNow,
      publicationDate: undefined,
      thumbnail: undefined,
      directory: undefined,
      embargo: undefined,
      tabularData: undefined,
      description: 'This is an example file',
      checksum: {
        algorithm: 'MD5',
        value: '0187a54071542738aa47939e8218e5f2'
      },
      persistentId: undefined,
      isActivelyEmbargoed: false,
      isTabular: false
    },
    permissions: { canDownloadFile: true }
  }
}

const expectedFileCitationRegex = new RegExp(
  `^Finch, Fiona, ${new Date().getFullYear()}, "Darwin's Finches", <a href="https:\\/\\/doi\\.org\\/10\\.5072\\/FK2\\/[A-Z0-9]+" target="_blank">https:\\/\\/doi\\.org\\/10\\.5072\\/FK2\\/[A-Z0-9]+<\\/a>, Root, DRAFT VERSION; blob \\[fileName\\]$`
)
const fileExpectedData = (id: number): File => {
  return {
    id: id,
    name: 'blob',
    datasetVersion: DatasetVersionMother.createRealistic(), // TODO: add dataset version to get file
    access: {
      restricted: false,
      latestVersionRestricted: false,
      canBeRequested: false,
      requested: false
    },
    citation: '',
    ingest: new FileIngest(FileIngestStatus.NONE),
    metadata: {
      type: new FileType('text/plain'),
      size: new FileSize(25, FileSizeUnit.BYTES),
      date: {
        type: FileDateType.DEPOSITED,
        date: dateNow
      },
      downloadCount: 0,
      labels: [],
      isDeleted: false,
      downloadUrls: {
        original: `/api/access/datafile/${id}?format=original`,
        tabular: `/api/access/datafile/${id}`,
        rData: `/api/access/datafile/${id}?format=RData`
      },
      depositDate: dateNow,
      publicationDate: undefined,
      thumbnail: undefined,
      directory: undefined,
      embargo: undefined,
      tabularData: undefined,
      description: 'This is an example file',
      checksum: {
        algorithm: 'MD5',
        value: '0187a54071542738aa47939e8218e5f2'
      },
      persistentId: undefined,
      isActivelyEmbargoed: false,
      isTabular: false
    },
    permissions: { canDownloadFile: true }
  }
}

describe('File JSDataverse Repository', () => {
  before(() => {
    TestsUtils.setup()
  })
  beforeEach(() => {
    TestsUtils.login()
  })

  const compareMetadata = (fileMetadata: FileMetadata, expectedFileMetadata: FileMetadata) => {
    expect(fileMetadata.type).to.deep.equal(expectedFileMetadata.type)
    cy.compareDate(fileMetadata.date.date, expectedFileMetadata.date.date)
    expect(fileMetadata.downloadCount).to.deep.equal(expectedFileMetadata.downloadCount)
    expect(fileMetadata.labels).to.deep.equal(expectedFileMetadata.labels)
    expect(fileMetadata.checksum?.algorithm).to.deep.equal(expectedFileMetadata.checksum?.algorithm)
    expect(fileMetadata.thumbnail).to.deep.equal(expectedFileMetadata.thumbnail)
    expect(fileMetadata.directory).to.deep.equal(expectedFileMetadata.directory)
    expect(fileMetadata.embargo).to.deep.equal(expectedFileMetadata.embargo)
    expect(fileMetadata.tabularData).to.deep.equal(expectedFileMetadata.tabularData)
    expect(fileMetadata.description).to.deep.equal(expectedFileMetadata.description)
    expect(fileMetadata.downloadUrls).to.deep.equal(expectedFileMetadata.downloadUrls)
    expect(fileMetadata.isDeleted).to.deep.equal(expectedFileMetadata.isDeleted)
  }

  describe('Get all files by dataset persistentId', () => {
    it('gets all the files by dataset persistentId with the basic information', async () => {
      const dataset = await DatasetHelper.createWithFiles(FileHelper.createMany(3)).then(
        (datasetResponse) => datasetRepository.getByPersistentId(datasetResponse.persistentId)
      )
      if (!dataset) throw new Error('Dataset not found')

      await fileRepository
        .getAllByDatasetPersistentId(dataset.persistentId, dataset.version)
        .then((files) => {
          files.forEach((file, index) => {
            const expectedFileNames = ['blob', 'blob-1', 'blob-2']
            const expectedFile = filePreviewExpectedData(file.id)
            expect(file.name).to.deep.equal(expectedFileNames[index])
            expect(file.datasetPublishingStatus).to.deep.equal(expectedFile.datasetPublishingStatus)
            expect(file.access).to.deep.equal(expectedFile.access)
            compareMetadata(file.metadata, expectedFile.metadata)
            expect(file.ingest).to.deep.equal(expectedFile.ingest)
            expect(file.permissions).to.deep.equal(expectedFile.permissions)
          })
        })
    })

    it('gets all the files by dataset persistentId with the correct size', async () => {
      const expectedSize = new FileSize(25, FileSizeUnit.BYTES)
      const fileData: FileData = {
        file: new Blob([new ArrayBuffer(expectedSize.value)], { type: 'text/csv' }),
        jsonData: JSON.stringify({ description: 'This is an example file' })
      }
      const dataset = await DatasetHelper.createWithFiles([fileData]).then((datasetResponse) =>
        datasetRepository.getByPersistentId(datasetResponse.persistentId)
      )
      if (!dataset) throw new Error('Dataset not found')

      await fileRepository
        .getAllByDatasetPersistentId(dataset.persistentId, dataset.version)
        .then((files) => {
          expect(files[0].metadata.size).to.deep.equal(expectedSize)
        })
    })

    it('gets all the files by dataset persistentId after dataset publication', async () => {
      const dataset = await DatasetHelper.createWithFiles(FileHelper.createMany(3)).then(
        (datasetResponse) => datasetRepository.getByPersistentId(datasetResponse.persistentId)
      )
      if (!dataset) throw new Error('Dataset not found')

      await DatasetHelper.publish(dataset.persistentId)
      await TestsUtils.waitForNoLocks(dataset.persistentId) // Wait for the dataset to be published

      await fileRepository
        .getAllByDatasetPersistentId(
          dataset.persistentId,
          DatasetVersionMother.createReleased({ id: dataset.version.id })
        )
        .then((files) => {
          const expectedPublishedFile = filePreviewExpectedData(files[0].id)
          expectedPublishedFile.datasetPublishingStatus = DatasetPublishingStatus.RELEASED
          expectedPublishedFile.metadata.date.type = FileDateType.PUBLISHED

          files.forEach((file) => {
            expect(file.datasetPublishingStatus).to.deep.equal(
              expectedPublishedFile.datasetPublishingStatus
            )
            cy.compareDate(
              file.metadata.date.date,
              filePreviewExpectedData(file.id).metadata.date.date
            )
          })
        })
    })

    it('gets all the files by dataset persistentId after dataset deaccession', async () => {
      const datasetResponse = await DatasetHelper.createWithFiles(FileHelper.createMany(3))

      await DatasetHelper.publish(datasetResponse.persistentId)
      await TestsUtils.waitForNoLocks(datasetResponse.persistentId) // Wait for the dataset to be published

      const dataset = await datasetRepository.getByPersistentId(datasetResponse.persistentId)
      if (!dataset) throw new Error('Dataset not found')

      await DatasetHelper.deaccession(datasetResponse.id)

      await fileRepository
        .getAllByDatasetPersistentId(
          dataset.persistentId,
          DatasetVersionMother.createDeaccessioned({ id: dataset.version.id })
        )
        .then((files) => {
          const expectedDeaccessionedFile = filePreviewExpectedData(files[0].id)
          expectedDeaccessionedFile.datasetPublishingStatus = DatasetPublishingStatus.DEACCESSIONED

          files.forEach((file) => {
            expect(file.datasetPublishingStatus).to.deep.equal(
              expectedDeaccessionedFile.datasetPublishingStatus
            )
          })
        })
    })

    it('gets all the files by dataset persistentId after file has been downloaded', async () => {
      const datasetResponse = await DatasetHelper.createWithFiles(FileHelper.createMany(3))
      if (!datasetResponse.files) throw new Error('Files not found')

      await DatasetHelper.publish(datasetResponse.persistentId)
      await TestsUtils.waitForNoLocks(datasetResponse.persistentId) // Wait for the dataset to be published

      const dataset = await datasetRepository.getByPersistentId(datasetResponse.persistentId)
      if (!dataset) throw new Error('Dataset not found')

      await FileHelper.download(datasetResponse.files[0].id)
      await TestsUtils.wait(1500) // Wait for the file to be downloaded

      await fileRepository
        .getAllByDatasetPersistentId(dataset.persistentId, dataset.version)
        .then((files) => {
          const expectedDownloadCount = 1
          expect(files[0].metadata.downloadCount).to.deep.equal(expectedDownloadCount)
        })
    })

    it('gets all the files by dataset persistentId after adding category labels to the files', async () => {
      const datasetResponse = await DatasetHelper.createWithFiles(FileHelper.createMany(3))
      if (!datasetResponse.files) throw new Error('Files not found')

      const dataset = await datasetRepository.getByPersistentId(datasetResponse.persistentId)
      if (!dataset) throw new Error('Dataset not found')

      const expectedLabels = [
        { type: FileLabelType.CATEGORY, value: 'category' },
        { type: FileLabelType.CATEGORY, value: 'category_2' }
      ]
      await FileHelper.addLabel(datasetResponse.files[0].id, expectedLabels)

      await fileRepository
        .getAllByDatasetPersistentId(dataset.persistentId, dataset.version)
        .then((files) => {
          expect(files[0].metadata.labels).to.deep.equal(expectedLabels)
        })
    })

    it('gets all the files by dataset persistentId after adding tag labels to the files', async () => {
      const datasetResponse = await DatasetHelper.createWithFiles(FileHelper.createMany(1, 'csv'))
      if (!datasetResponse.files) throw new Error('Files not found')
      await TestsUtils.waitForNoLocks(datasetResponse.persistentId) // Wait for the tabular data to be ingested
      const dataset = await datasetRepository.getByPersistentId(datasetResponse.persistentId)
      if (!dataset) throw new Error('Dataset not found')

      const expectedLabels = [{ type: FileLabelType.TAG, value: 'Survey' }]
      await FileHelper.addLabel(datasetResponse.files[0].id, expectedLabels)

      await fileRepository
        .getAllByDatasetPersistentId(dataset.persistentId, dataset.version)
        .then((files) => {
          expect(files[0].metadata.labels).to.deep.equal(expectedLabels)
        })
    })

    it('gets all the files by dataset persistentId after adding a thumbnail to the files', async () => {
      const datasetResponse = await FileHelper.createImage().then((file) =>
        DatasetHelper.createWithFiles([file])
      )
      if (!datasetResponse.files) throw new Error('Files not found')

      const dataset = await datasetRepository.getByPersistentId(datasetResponse.persistentId)
      if (!dataset) throw new Error('Dataset not found')

      await fileRepository
        .getAllByDatasetPersistentId(dataset.persistentId, dataset.version)
        .then((files) => {
          expect(files[0].metadata.thumbnail).to.not.be.undefined
        })
    })

    it('gets all the files by dataset persistentId after embargo', async () => {
      const datasetResponse = await DatasetHelper.createWithFiles(FileHelper.createMany(3))
      if (!datasetResponse.files) throw new Error('Files not found')

      const dataset = await datasetRepository.getByPersistentId(datasetResponse.persistentId)
      if (!dataset) throw new Error('Dataset not found')

      const embargoDate = '2100-10-20'
      await DatasetHelper.embargoFiles(
        datasetResponse.persistentId,
        [datasetResponse.files[0].id, datasetResponse.files[1].id, datasetResponse.files[2].id],
        embargoDate
      )
      await TestsUtils.waitForNoLocks(datasetResponse.persistentId) // Wait for the files to be embargoed

      await fileRepository
        .getAllByDatasetPersistentId(dataset.persistentId, dataset.version)
        .then((files) => {
          const expectedEmbargo = new FileEmbargo(new Date(embargoDate))
          expect(files[0].metadata.embargo).to.deep.equal(expectedEmbargo)
        })
    })

    it('gets all the files by dataset persistentId when files are tabular data', async () => {
      const datasetResponse = await DatasetHelper.createWithFiles(FileHelper.createMany(1, 'csv'))
      if (!datasetResponse.files) throw new Error('Files not found')

      const dataset = await datasetRepository.getByPersistentId(datasetResponse.persistentId)
      if (!dataset) throw new Error('Dataset not found')

      await fileRepository
        .getAllByDatasetPersistentId(dataset.persistentId, dataset.version)
        .then((files) => {
          const expectedTabularData = {
            variablesCount: 7,
            observationsCount: 10
          }
          files.forEach((file) => {
            expect(file.metadata.tabularData?.variablesCount).to.deep.equal(
              expectedTabularData.variablesCount
            )
            expect(file.metadata.tabularData?.observationsCount).to.deep.equal(
              expectedTabularData.observationsCount
            )
            expect(file.metadata.tabularData?.unf).to.not.be.undefined
          })
        })
    })

    it('gets the files pagination selection when passing pagination', async () => {
      const dataset = await DatasetHelper.createWithFiles(FileHelper.createMany(3)).then(
        (datasetResponse) => datasetRepository.getByPersistentId(datasetResponse.persistentId)
      )
      if (!dataset) throw new Error('Dataset not found')

      await fileRepository
        .getAllByDatasetPersistentId(
          dataset.persistentId,
          dataset.version,
          new FilePaginationInfo(2, 1, 3)
        )
        .then((files) => {
          files.forEach((file, index) => {
            const expectedFileNames = ['blob-1']
            expect(file.name).to.deep.equal(expectedFileNames[index])
          })
        })
    })

    it('gets all the files by dataset persistentId when passing sortBy criteria', async () => {
      const dataset = await DatasetHelper.createWithFiles(FileHelper.createMany(3)).then(
        (datasetResponse) => datasetRepository.getByPersistentId(datasetResponse.persistentId)
      )
      if (!dataset) throw new Error('Dataset not found')

      await fileRepository
        .getAllByDatasetPersistentId(
          dataset.persistentId,
          dataset.version,
          new FilePaginationInfo(),
          new FileCriteria().withSortBy(FileSortByOption.NAME_ZA)
        )
        .then((files) => {
          files.forEach((file, index) => {
            const expectedFileNames = ['blob-2', 'blob-1', 'blob']
            expect(file.name).to.deep.equal(expectedFileNames[index])
          })
        })
    })

    it('gets all the files by dataset persistentId when passing filterByType criteria', async () => {
      const dataset = await DatasetHelper.createWithFiles([
        FileHelper.create('txt'),
        FileHelper.create('txt'),
        FileHelper.create('csv')
      ]).then((datasetResponse) =>
        datasetRepository.getByPersistentId(datasetResponse.persistentId)
      )
      if (!dataset) throw new Error('Dataset not found')

      await fileRepository
        .getAllByDatasetPersistentId(
          dataset.persistentId,
          dataset.version,
          new FilePaginationInfo(),
          new FileCriteria().withFilterByType('text/tab-separated-values')
        )
        .then((files) => {
          expect(files.length).to.equal(1)
        })
    })

    it('gets all the files by dataset persistentId when passing filterByAccess criteria', async () => {
      const datasetResponse = await DatasetHelper.createWithFiles(FileHelper.createMany(3))
      if (!datasetResponse.files) throw new Error('Files not found')

      const dataset = await datasetRepository.getByPersistentId(datasetResponse.persistentId)
      if (!dataset) throw new Error('Dataset not found')

      await FileHelper.restrict(datasetResponse.files[0].id)

      await fileRepository
        .getAllByDatasetPersistentId(
          dataset.persistentId,
          dataset.version,
          new FilePaginationInfo(),
          new FileCriteria().withFilterByAccess(FileAccessOption.RESTRICTED)
        )
        .then((files) => {
          expect(files.length).to.equal(1)
        })
    })

    it('gets all the files by dataset persistentId when passing filterByTag criteria', async () => {
      const datasetResponse = await DatasetHelper.createWithFiles(FileHelper.createMany(3))
      if (!datasetResponse.files) throw new Error('Files not found')

      const dataset = await datasetRepository.getByPersistentId(datasetResponse.persistentId)
      if (!dataset) throw new Error('Dataset not found')

      const category = { type: FileLabelType.CATEGORY, value: 'category' }
      await FileHelper.addLabel(datasetResponse.files[0].id, [category])

      await fileRepository
        .getAllByDatasetPersistentId(
          dataset.persistentId,
          dataset.version,
          new FilePaginationInfo(),
          new FileCriteria().withFilterByTag(category.value)
        )
        .then((files) => {
          expect(files.length).to.equal(1)
        })
    })

    it('gets all the files by dataset persistentId when passing searchText criteria', async () => {
      const dataset = await DatasetHelper.createWithFiles(FileHelper.createMany(3)).then(
        (datasetResponse) => datasetRepository.getByPersistentId(datasetResponse.persistentId)
      )
      if (!dataset) throw new Error('Dataset not found')

      await fileRepository
        .getAllByDatasetPersistentId(
          dataset.persistentId,
          dataset.version,
          new FilePaginationInfo(),
          new FileCriteria().withSearchText('blob-1')
        )
        .then((files) => {
          expect(files.length).to.equal(1)
        })
    })

    it.skip('gets all the files when they are deleted', async () => {
      // This test is failing because js-dataverse deleted property always returns undefined
      // TODO: Remove the skip once the issue is fixed
      const datasetResponse = await DatasetHelper.createWithFiles(FileHelper.createMany(1))

      await DatasetHelper.publish(datasetResponse.persistentId)
      await TestsUtils.wait(2000) // Wait for the dataset to be published

      const dataset = await datasetRepository.getByPersistentId(datasetResponse.persistentId)
      if (!dataset) throw new Error('Dataset not found')

      if (!datasetResponse.files) throw new Error('Files not found')
      datasetResponse.files.map((file) => FileHelper.delete(file.id))

      await fileRepository
        .getAllByDatasetPersistentId(dataset.persistentId, dataset.version)
        .then((files) => {
          files.forEach((file) => {
            expect(file.metadata.isDeleted).to.equal(true)
          })
        })
    })
  })

  describe('Get FilesCountInfo by dataset persistentId', () => {
    let datasetPersistentId = ''
    before(async () => {
      const files = [
        FileHelper.create('csv', {
          description: 'Some description',
          categories: ['category'],
          restrict: 'true',
          tabIngest: 'false'
        }),
        FileHelper.create('txt', {
          description: 'Some description',
          tabIngest: 'false'
        }),
        FileHelper.create('csv', {
          description: 'Some description',
          categories: ['category'],
          tabIngest: 'false'
        }),
        FileHelper.create('txt', {
          description: 'Some description',
          categories: ['category_1']
        }),
        FileHelper.create('csv', {
          description: 'Some description',
          categories: ['category_1'],
          restrict: 'true',
          tabIngest: 'false'
        }),
        FileHelper.create('txt', {
          description: 'Some description',
          categories: ['category'],
          restrict: 'true',
          tabIngest: 'false'
        })
      ]
      await DatasetHelper.createWithFiles(files).then((datasetResponse) => {
        datasetPersistentId = datasetResponse.persistentId
      })
    })

    it('gets FilesCountInfo by dataset persistentId', async () => {
      const dataset = await datasetRepository.getByPersistentId(datasetPersistentId)
      if (!dataset) throw new Error('Dataset not found')

      const expectedFilesCountInfo: FilesCountInfo = {
        total: 6,
        perAccess: [
          {
            access: FileAccessOption.PUBLIC,
            count: 3
          },
          {
            access: FileAccessOption.RESTRICTED,
            count: 3
          }
        ],
        perFileType: [
          {
            type: new FileType('text/csv'),
            count: 3
          },
          {
            type: new FileType('text/plain'),
            count: 3
          }
        ],
        perFileTag: [
          {
            tag: new FileTag('category_1'),
            count: 2
          },
          {
            tag: new FileTag('category'),
            count: 3
          }
        ]
      }

      await fileRepository
        .getFilesCountInfoByDatasetPersistentId(
          dataset.persistentId,
          dataset.version.number,
          new FileCriteria()
        )
        .then((filesCountInfo) => {
          expect(filesCountInfo.total).to.deep.equal(expectedFilesCountInfo.total)

          const filesCountInfoPerAccessSorted = filesCountInfo.perAccess.sort((a, b) =>
            a.access.localeCompare(b.access)
          )
          const expectedFilesCountInfoPerAccessSorted = expectedFilesCountInfo.perAccess.sort(
            (a, b) => a.access.localeCompare(b.access)
          )
          expect(filesCountInfoPerAccessSorted).to.deep.equal(expectedFilesCountInfoPerAccessSorted)

          const filesCountInfoPerFileTypeSorted = filesCountInfo.perFileType.sort((a, b) =>
            a.type.value.localeCompare(b.type.value)
          )
          const expectedFilesCountInfoPerFileTypeSorted = expectedFilesCountInfo.perFileType.sort(
            (a, b) => a.type.value.localeCompare(b.type.value)
          )
          expect(filesCountInfoPerFileTypeSorted).to.deep.equal(
            expectedFilesCountInfoPerFileTypeSorted
          )

          const filesCountInfoPerFileTagSorted = filesCountInfo.perFileTag.sort((a, b) =>
            a.tag.value.localeCompare(b.tag.value)
          )
          const expectedFilesCountInfoPerFileTagSorted = expectedFilesCountInfo.perFileTag.sort(
            (a, b) => a.tag.value.localeCompare(b.tag.value)
          )
          expect(filesCountInfoPerFileTagSorted).to.deep.equal(
            expectedFilesCountInfoPerFileTagSorted
          )
        })
    })

    it('gets FilesCountInfo by dataset persistentId when passing filterByType criteria', async () => {
      const dataset = await datasetRepository.getByPersistentId(datasetPersistentId)
      if (!dataset) throw new Error('Dataset not found')

      const expectedFilesCountInfo: FilesCountInfo = {
        total: 3,
        perAccess: [
          {
            access: FileAccessOption.RESTRICTED,
            count: 2
          },
          {
            access: FileAccessOption.PUBLIC,
            count: 1
          }
        ],
        perFileType: [
          {
            type: new FileType('text/csv'),
            count: 3
          }
        ],
        perFileTag: [
          {
            tag: new FileTag('category_1'),
            count: 1
          },
          {
            tag: new FileTag('category'),
            count: 2
          }
        ]
      }

      await fileRepository
        .getFilesCountInfoByDatasetPersistentId(
          dataset.persistentId,
          dataset.version.number,
          new FileCriteria().withFilterByType('text/csv')
        )
        .then((filesCountInfo) => {
          expect(filesCountInfo.total).to.deep.equal(expectedFilesCountInfo.total)

          const filesCountInfoPerAccessSorted = filesCountInfo.perAccess.sort((a, b) =>
            a.access.localeCompare(b.access)
          )
          const expectedFilesCountInfoPerAccessSorted = expectedFilesCountInfo.perAccess.sort(
            (a, b) => a.access.localeCompare(b.access)
          )
          expect(filesCountInfoPerAccessSorted).to.deep.equal(expectedFilesCountInfoPerAccessSorted)

          const filesCountInfoPerFileTypeSorted = filesCountInfo.perFileType.sort((a, b) =>
            a.type.value.localeCompare(b.type.value)
          )
          const expectedFilesCountInfoPerFileTypeSorted = expectedFilesCountInfo.perFileType.sort(
            (a, b) => a.type.value.localeCompare(b.type.value)
          )
          expect(filesCountInfoPerFileTypeSorted).to.deep.equal(
            expectedFilesCountInfoPerFileTypeSorted
          )

          const filesCountInfoPerFileTagSorted = filesCountInfo.perFileTag.sort((a, b) =>
            a.tag.value.localeCompare(b.tag.value)
          )
          const expectedFilesCountInfoPerFileTagSorted = expectedFilesCountInfo.perFileTag.sort(
            (a, b) => a.tag.value.localeCompare(b.tag.value)
          )
          expect(filesCountInfoPerFileTagSorted).to.deep.equal(
            expectedFilesCountInfoPerFileTagSorted
          )
        })
    })
  })

  describe('getFilesTotalDownloadSizeByDatasetPersistentId', () => {
    it('gets the total download size of all files in a dataset', async () => {
      const files = [
        FileHelper.create('csv', {
          description: 'Some description',
          categories: ['category'],
          restrict: 'true',
          tabIngest: 'false'
        }),
        FileHelper.create('txt', {
          description: 'Some description',
          tabIngest: 'false'
        }),
        FileHelper.create('txt', {
          description: 'Some description',
          categories: ['category_1']
        })
      ]
      const dataset = await DatasetHelper.createWithFiles(files).then((datasetResponse) =>
        datasetRepository.getByPersistentId(datasetResponse.persistentId)
      )
      if (!dataset) throw new Error('Dataset not found')

      await TestsUtils.waitForNoLocks(dataset.persistentId) // wait for the files to be ingested

      const expectedTotalDownloadSize = await fileRepository
        .getAllByDatasetPersistentId(dataset.persistentId, dataset.version)
        .then((files) => {
          return files.reduce((totalDownloadSize, file) => {
            return totalDownloadSize + file.metadata.size.toBytes()
          }, 0)
        })
      await fileRepository
        .getFilesTotalDownloadSizeByDatasetPersistentId(
          dataset.persistentId,
          dataset.version.number
        )
        .then((totalDownloadSize) => {
          expect(totalDownloadSize).to.deep.equal(expectedTotalDownloadSize)
        })
    })

    it('gets the total download size of all files in a dataset when passing files criteria', async () => {
      const files = [
        FileHelper.create('csv', {
          description: 'Some description',
          categories: ['category'],
          restrict: 'true',
          tabIngest: 'false'
        }),
        FileHelper.create('txt', {
          description: 'Some description',
          tabIngest: 'false'
        }),
        FileHelper.create('txt', {
          description: 'Some description',
          categories: ['category_1']
        })
      ]
      const dataset = await DatasetHelper.createWithFiles(files).then((datasetResponse) =>
        datasetRepository.getByPersistentId(datasetResponse.persistentId)
      )
      if (!dataset) throw new Error('Dataset not found')

      await TestsUtils.waitForNoLocks(dataset.persistentId) // wait for the files to be ingested

      const expectedTotalDownloadSize = await fileRepository
        .getAllByDatasetPersistentId(
          dataset.persistentId,
          dataset.version,
          new FilePaginationInfo(1, 10, 3),
          new FileCriteria().withFilterByType('csv')
        )
        .then((files) => {
          return files.reduce((totalDownloadSize, file) => {
            return totalDownloadSize + file.metadata.size.toBytes()
          }, 0)
        })
      await fileRepository
        .getFilesTotalDownloadSizeByDatasetPersistentId(
          dataset.persistentId,
          dataset.version.number,
          new FileCriteria().withFilterByType('csv')
        )
        .then((totalDownloadSize) => {
          expect(totalDownloadSize).to.deep.equal(expectedTotalDownloadSize)
        })
    })
  })

  describe('getById', () => {
    it('gets a file by id', async () => {
      const datasetResponse = await DatasetHelper.createWithFile(FileHelper.create())
      if (!datasetResponse.file) throw new Error('File not found')

      const expectedFile = fileExpectedData(datasetResponse.file.id)

      await fileRepository.getById(datasetResponse.file.id).then((file) => {
        expect(file.name).to.deep.equal(expectedFile.name)
        expect(file.ingest).to.deep.equal(expectedFile.ingest)
        expect(file.access).to.deep.equal(expectedFile.access)
        expect(file.permissions).to.deep.equal(expectedFile.permissions)
        expect(file.datasetVersion).to.deep.equal(expectedFile.datasetVersion)
        expect(file.citation).to.match(expectedFileCitationRegex)
        compareMetadata(file.metadata, expectedFile.metadata)
      })
    })
  })
})
