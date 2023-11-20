import { TestsUtils } from '../../shared/TestsUtils'
import { FileJSDataverseRepository } from '../../../../src/files/infrastructure/FileJSDataverseRepository'
import {
  File,
  FileDateType,
  FileEmbargo,
  FileIngestStatus,
  FileLabelType,
  FilePublishingStatus,
  FileSize,
  FileSizeUnit,
  FileType
} from '../../../../src/files/domain/models/File'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { DatasetJSDataverseRepository } from '../../../../src/dataset/infrastructure/repositories/DatasetJSDataverseRepository'
import {
  DatasetPublishingStatus,
  DatasetVersion
} from '../../../../src/dataset/domain/models/Dataset'
import {
  FileAccessOption,
  FileCriteria,
  FileSortByOption,
  FileTag
} from '../../../../src/files/domain/models/FileCriteria'
import { DatasetHelper } from '../../shared/datasets/DatasetHelper'
import { FileData, FileHelper } from '../../shared/files/FileHelper'
import { FilesCountInfo } from '../../../../src/files/domain/models/FilesCountInfo'
import { FilePaginationInfo } from '../../../../src/files/domain/models/FilePaginationInfo'

chai.use(chaiAsPromised)
const expect = chai.expect

const fileRepository = new FileJSDataverseRepository()
const datasetRepository = new DatasetJSDataverseRepository()
const dateNow = new Date()
dateNow.setHours(2, 0, 0, 0)
const expectedFile = new File(
  1,
  { number: 1, publishingStatus: FilePublishingStatus.DRAFT },
  'blob',
  {
    restricted: false,
    latestVersionRestricted: false,
    canBeRequested: false,
    requested: false
  },
  new FileType('text/plain'),
  new FileSize(25, FileSizeUnit.BYTES),
  {
    type: FileDateType.DEPOSITED,
    date: dateNow
  },
  0,
  [],
  false,
  { status: FileIngestStatus.NONE },
  {
    algorithm: 'MD5',
    value: '0187a54071542738aa47939e8218e5f2'
  },
  undefined,
  undefined,
  undefined,
  undefined,
  'This is an example file'
)

describe('File JSDataverse Repository', () => {
  before(() => {
    TestsUtils.setup()
  })
  beforeEach(() => {
    TestsUtils.login()
  })

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
            expect(file.name).to.deep.equal(expectedFileNames[index])
            expect(file.version).to.deep.equal(expectedFile.version)
            expect(file.access).to.deep.equal(expectedFile.access)
            expect(file.type).to.deep.equal(expectedFile.type)
            cy.compareDate(file.date.date, expectedFile.date.date)
            expect(file.downloadCount).to.deep.equal(expectedFile.downloadCount)
            expect(file.labels).to.deep.equal(expectedFile.labels)
            expect(file.checksum?.algorithm).to.deep.equal(expectedFile.checksum?.algorithm)
            expect(file.thumbnail).to.deep.equal(expectedFile.thumbnail)
            expect(file.directory).to.deep.equal(expectedFile.directory)
            expect(file.embargo).to.deep.equal(expectedFile.embargo)
            expect(file.tabularData).to.deep.equal(expectedFile.tabularData)
            expect(file.description).to.deep.equal(expectedFile.description)
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
          expect(files[0].size).to.deep.equal(expectedSize)
        })
    })

    it('gets all the files by dataset persistentId after dataset publication', async () => {
      const dataset = await DatasetHelper.createWithFiles(FileHelper.createMany(3)).then(
        (datasetResponse) => datasetRepository.getByPersistentId(datasetResponse.persistentId)
      )
      if (!dataset) throw new Error('Dataset not found')

      await DatasetHelper.publish(dataset.persistentId)
      await TestsUtils.wait(1500) // Wait for the dataset to be published

      await fileRepository
        .getAllByDatasetPersistentId(
          dataset.persistentId,
          new DatasetVersion(
            dataset.version.id,
            DatasetPublishingStatus.RELEASED,
            true,
            false,
            DatasetPublishingStatus.RELEASED,
            1,
            0
          )
        )
        .then((files) => {
          const expectedPublishedFile = expectedFile
          expectedPublishedFile.version.publishingStatus = FilePublishingStatus.RELEASED
          expectedPublishedFile.date.type = FileDateType.PUBLISHED

          files.forEach((file) => {
            expect(file.version).to.deep.equal(expectedPublishedFile.version)
            cy.compareDate(file.date.date, expectedFile.date.date)
          })
        })
    })

    it('gets all the files by dataset persistentId after dataset deaccession', async () => {
      const dataset = await DatasetHelper.createWithFiles(FileHelper.createMany(3)).then(
        (datasetResponse) => datasetRepository.getByPersistentId(datasetResponse.persistentId)
      )
      if (!dataset) throw new Error('Dataset not found')

      await DatasetHelper.publish(dataset.persistentId)
      await TestsUtils.wait(1500) // Wait for the dataset to be published

      DatasetHelper.deaccession(dataset.persistentId)
      await TestsUtils.wait(1500) // Wait for the dataset to be deaccessioned
      await TestsUtils.wait(1500) // Wait for the dataset to be deaccessioned
      await TestsUtils.wait(1500) // Wait for the dataset to be deaccessioned

      await fileRepository
        .getAllByDatasetPersistentId(
          dataset.persistentId,
          new DatasetVersion(
            dataset.version.id,
            DatasetPublishingStatus.DEACCESSIONED,
            true,
            false,
            DatasetPublishingStatus.DEACCESSIONED,
            1,
            0
          )
        )
        .then((files) => {
          const expectedDeaccessionedFile = expectedFile
          expectedDeaccessionedFile.version.publishingStatus = FilePublishingStatus.DEACCESSIONED

          files.forEach((file) => {
            expect(file.version).to.deep.equal(expectedDeaccessionedFile.version)
          })
        })
    })

    it('gets all the files by dataset persistentId after file has been downloaded', async () => {
      const datasetResponse = await DatasetHelper.createWithFiles(FileHelper.createMany(3))
      if (!datasetResponse.files) throw new Error('Files not found')

      await DatasetHelper.publish(datasetResponse.persistentId)
      await TestsUtils.wait(1500) // Wait for the dataset to be published

      const dataset = await datasetRepository.getByPersistentId(datasetResponse.persistentId)
      if (!dataset) throw new Error('Dataset not found')

      await FileHelper.download(datasetResponse.files[0].id)
      await TestsUtils.wait(1500) // Wait for the file to be downloaded

      await fileRepository
        .getAllByDatasetPersistentId(dataset.persistentId, dataset.version)
        .then((files) => {
          const expectedDownloadCount = 1
          expect(files[0].downloadCount).to.deep.equal(expectedDownloadCount)
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
          expect(files[0].labels).to.deep.equal(expectedLabels)
        })
    })

    it('gets all the files by dataset persistentId after adding tag labels to the files', async () => {
      const datasetResponse = await DatasetHelper.createWithFiles(FileHelper.createMany(1, 'csv'))
      if (!datasetResponse.files) throw new Error('Files not found')
      await TestsUtils.wait(1500) // Wait for the tabular data to be ingested

      const dataset = await datasetRepository.getByPersistentId(datasetResponse.persistentId)
      if (!dataset) throw new Error('Dataset not found')

      const expectedLabels = [{ type: FileLabelType.TAG, value: 'Survey' }]
      await FileHelper.addLabel(datasetResponse.files[0].id, expectedLabels)

      await fileRepository
        .getAllByDatasetPersistentId(dataset.persistentId, dataset.version)
        .then((files) => {
          expect(files[0].labels).to.deep.equal(expectedLabels)
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
          expect(files[0].thumbnail).to.not.be.undefined
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
      await TestsUtils.wait(1500) // Wait for the files to be embargoed

      await fileRepository
        .getAllByDatasetPersistentId(dataset.persistentId, dataset.version)
        .then((files) => {
          const expectedEmbargo = new FileEmbargo(new Date(embargoDate))
          expect(files[0].embargo).to.deep.equal(expectedEmbargo)
        })
    })

    it.skip('gets all the files by dataset persistentId when files are tabular data', async () => {
      // TODO - Implement this when isTabularData flag is added to js-dataverse response
      const datasetResponse = await DatasetHelper.createWithFiles(FileHelper.createMany(1, 'csv'))
      if (!datasetResponse.files) throw new Error('Files not found')

      const dataset = await datasetRepository.getByPersistentId(datasetResponse.persistentId)
      if (!dataset) throw new Error('Dataset not found')

      await fileRepository
        .getAllByDatasetPersistentId(dataset.persistentId, dataset.version)
        .then((files) => {
          const expectedTabularData = {
            variablesCount: 1,
            observationsCount: 0,
            unf: 'some'
          }
          files.forEach((file) => {
            expect(file.tabularData).to.deep.equal(expectedTabularData)
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
  })

  describe('Get file user permissions by id', () => {
    it('gets file user permissions by id', async () => {
      const datasetResponse = await DatasetHelper.createWithFiles(FileHelper.createMany(1))
      if (!datasetResponse.files) throw new Error('Files not found')

      const expectedFileUserPermissions = {
        fileId: datasetResponse.files[0].id,
        canDownloadFile: true,
        canEditDataset: true
      }

      await fileRepository
        .getUserPermissionsById(datasetResponse.files[0].id)
        .then((fileUserPermissions) => {
          expect(fileUserPermissions).to.deep.equal(expectedFileUserPermissions)
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
            access: FileAccessOption.RESTRICTED,
            count: 3
          },
          {
            access: FileAccessOption.PUBLIC,
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
          dataset.version,
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
          dataset.version,
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

      await TestsUtils.wait(2500) // wait for the files to be ingested

      const expectedTotalDownloadSize = await fileRepository
        .getAllByDatasetPersistentId(dataset.persistentId, dataset.version)
        .then((files) => {
          return files.reduce((totalDownloadSize, file) => {
            return totalDownloadSize + file.size.toBytes()
          }, 0)
        })
      await fileRepository
        .getFilesTotalDownloadSizeByDatasetPersistentId(dataset.persistentId, dataset.version)
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

      await TestsUtils.wait(2500) // wait for the files to be ingested

      const expectedTotalDownloadSize = await fileRepository
        .getAllByDatasetPersistentId(
          dataset.persistentId,
          dataset.version,
          new FilePaginationInfo(1, 10, 3),
          new FileCriteria().withFilterByType('csv')
        )
        .then((files) => {
          return files.reduce((totalDownloadSize, file) => {
            return totalDownloadSize + file.size.toBytes()
          }, 0)
        })
      await fileRepository
        .getFilesTotalDownloadSizeByDatasetPersistentId(
          dataset.persistentId,
          dataset.version,
          new FileCriteria().withFilterByType('csv')
        )
        .then((totalDownloadSize) => {
          expect(totalDownloadSize).to.deep.equal(expectedTotalDownloadSize)
        })
    })
  })
})
