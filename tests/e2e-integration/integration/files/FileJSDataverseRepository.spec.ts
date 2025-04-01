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
import {
  DatasetLabelSemanticMeaning,
  DatasetLabelValue,
  DatasetNonNumericVersion,
  DatasetPublishingStatus,
  DatasetVersionNumber
} from '../../../../src/dataset/domain/models/Dataset'
import { File } from '../../../../src/files/domain/models/File'
import { FileIngest, FileIngestStatus } from '../../../../src/files/domain/models/FileIngest'
import { DateHelper } from '@/shared/helpers/DateHelper'

const DRAFT_PARAM = DatasetNonNumericVersion.DRAFT

chai.use(chaiAsPromised)
const expect = chai.expect

const fileRepository = new FileJSDataverseRepository()
const datasetRepository = new DatasetJSDataverseRepository()
const dateNow = DateHelper.toISO8601Format(new Date())
const filePreviewExpectedData = (id: number): Omit<FilePreview, 'datasetVersionNumber'> => {
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
    permissions: {
      canDownloadFile: true,
      canManageFilePermissions: true,
      canEditOwnerDataset: true
    }
  }
}

const expectedFileCitationRegex = new RegExp(
  `^Finch, Fiona, ${new Date().getFullYear()}, "Darwin's Finches", <a href="https:\\/\\/doi\\.org\\/10\\.5072\\/FK2\\/[A-Z0-9]+" target="_blank">https:\\/\\/doi\\.org\\/10\\.5072\\/FK2\\/[A-Z0-9]+<\\/a>, Root, DRAFT VERSION; blob \\[fileName\\]$`
)
const fileExpectedData = (id: number, datasetPid: string): Omit<File, 'hierarchy'> => {
  return {
    id: id,
    name: 'blob',
    datasetPersistentId: datasetPid,
    datasetVersion: {
      labels: [
        { semanticMeaning: DatasetLabelSemanticMeaning.DATASET, value: DatasetLabelValue.DRAFT },
        {
          semanticMeaning: DatasetLabelSemanticMeaning.WARNING,
          value: DatasetLabelValue.UNPUBLISHED
        }
      ],
      id: 74,
      title: "Darwin's Finches",
      number: new DatasetVersionNumber(undefined, undefined),
      publishingStatus: DatasetPublishingStatus.DRAFT,
      citation:
        'Finch, Fiona, 2024, "Darwin\'s Finches", <a href="https://doi.org/10.5072/FK2/M6AWUM" target="_blank">https://doi.org/10.5072/FK2/M6AWUM</a>, Root, DRAFT VERSION',
      isLatest: true,
      isInReview: false,
      latestVersionPublishingStatus: DatasetPublishingStatus.DRAFT,
      someDatasetVersionHasBeenReleased: false
    },
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
    permissions: {
      canDownloadFile: true,
      canManageFilePermissions: true,
      canEditOwnerDataset: true
    }
  }
}

describe('File JSDataverse Repository', () => {
  beforeEach(() => {
    TestsUtils.login().then((token) => {
      if (!token) {
        throw new Error('Token not found after Keycloak login')
      }

      cy.wrap(TestsUtils.setup(token))
    })
  })

  const compareMetadata = (fileMetadata: FileMetadata, expectedFileMetadata: FileMetadata) => {
    expect(fileMetadata.type).to.deep.equal(expectedFileMetadata.type)
    expect(fileMetadata.date.date).to.deep.equal(expectedFileMetadata.date.date)
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
      const datasetResponse = await DatasetHelper.createWithFiles(FileHelper.createMany(3))

      const dataset = await datasetRepository.getByPersistentId(
        datasetResponse.persistentId,
        DatasetNonNumericVersion.DRAFT
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
      const datasetResponse = await DatasetHelper.createWithFiles([fileData])

      const dataset = await datasetRepository.getByPersistentId(
        datasetResponse.persistentId,
        DatasetNonNumericVersion.DRAFT
      )

      if (!dataset) throw new Error('Dataset not found')

      await fileRepository
        .getAllByDatasetPersistentId(dataset.persistentId, dataset.version)
        .then((files) => {
          expect(files[0].metadata.size).to.deep.equal(expectedSize)
        })
    })

    it('gets all the files by dataset persistentId after dataset publication', async () => {
      const datasetResponse = await DatasetHelper.createWithFiles(FileHelper.createMany(3))

      const dataset = await datasetRepository.getByPersistentId(
        datasetResponse.persistentId,
        DatasetNonNumericVersion.DRAFT
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
            expect(file.metadata.date.date).to.deep.equal(
              filePreviewExpectedData(file.id).metadata.date.date
            )
          })
        })
    })

    it('gets all the files by dataset persistentId after dataset deaccession', async () => {
      const datasetResponse = await DatasetHelper.createWithFiles(FileHelper.createMany(3))

      await DatasetHelper.publish(datasetResponse.persistentId)
      await TestsUtils.waitForNoLocks(datasetResponse.persistentId) // Wait for the dataset to be published

      await DatasetHelper.deaccession(datasetResponse.id)

      const dataset = await datasetRepository.getByPersistentId(datasetResponse.persistentId)
      if (!dataset) throw new Error('Dataset not found')

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

      await FileHelper.download(datasetResponse.files[0].id)
      await TestsUtils.wait(3000) // Wait for the file to be downloaded

      const dataset = await datasetRepository.getByPersistentId(datasetResponse.persistentId)
      if (!dataset) throw new Error('Dataset not found')

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

      const expectedLabels = [
        { type: FileLabelType.CATEGORY, value: 'category' },
        { type: FileLabelType.CATEGORY, value: 'category_2' }
      ]
      await FileHelper.addLabel(datasetResponse.files[0].id, expectedLabels)

      const dataset = await datasetRepository.getByPersistentId(
        datasetResponse.persistentId,
        DatasetNonNumericVersion.DRAFT
      )
      if (!dataset) throw new Error('Dataset not found')

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

      const expectedLabels = [{ type: FileLabelType.TAG, value: 'Survey' }]
      await FileHelper.addLabel(datasetResponse.files[0].id, expectedLabels)

      const dataset = await datasetRepository.getByPersistentId(
        datasetResponse.persistentId,
        DatasetNonNumericVersion.DRAFT
      )
      if (!dataset) throw new Error('Dataset not found')

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

      const dataset = await datasetRepository.getByPersistentId(
        datasetResponse.persistentId,
        DatasetNonNumericVersion.DRAFT
      )
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

      const embargoDate = '2100-10-20'
      await DatasetHelper.embargoFiles(
        datasetResponse.persistentId,
        [datasetResponse.files[0].id, datasetResponse.files[1].id, datasetResponse.files[2].id],
        embargoDate
      )
      await TestsUtils.waitForNoLocks(datasetResponse.persistentId) // Wait for the files to be embargoed

      const dataset = await datasetRepository.getByPersistentId(
        datasetResponse.persistentId,
        DRAFT_PARAM
      )
      if (!dataset) throw new Error('Dataset not found')

      await fileRepository
        .getAllByDatasetPersistentId(dataset.persistentId, dataset.version)
        .then((files) => {
          const expectedEmbargo = new FileEmbargo(new Date(embargoDate))
          expect(files[0].metadata.embargo).to.deep.equal(expectedEmbargo)
        })
    })

    // TODO: Skipping because http://localhost:8000/api/v1/datasets/:persistentId/versions/:draft/files?persistentId=doi:10.5072/FK2/XRSQV4 is bringing dataFile.tabularData as false
    it.skip('gets all the files by dataset persistentId when files are tabular data', async () => {
      const datasetResponse = await DatasetHelper.createWithFiles(FileHelper.createMany(1, 'csv'))
      if (!datasetResponse.files) throw new Error('Files not found')

      const dataset = await datasetRepository.getByPersistentId(
        datasetResponse.persistentId,
        DRAFT_PARAM
      )
      if (!dataset) throw new Error('Dataset not found')

      await fileRepository
        .getAllByDatasetPersistentId(dataset.persistentId, dataset.version)
        .then((files) => {
          const expectedTabularData = {
            variables: 7,
            observations: 10
          }
          files.forEach((file) => {
            expect(file.metadata.tabularData?.variables).to.deep.equal(
              expectedTabularData.variables
            )
            expect(file.metadata.tabularData?.observations).to.deep.equal(
              expectedTabularData.observations
            )
            expect(file.metadata.tabularData?.unf).to.not.be.undefined
          })
        })
    })

    it('gets the files pagination selection when passing pagination', async () => {
      const datasetResponse = await DatasetHelper.createWithFiles(FileHelper.createMany(3))

      const dataset = await datasetRepository.getByPersistentId(
        datasetResponse.persistentId,
        DRAFT_PARAM
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
      const datasetResponse = await DatasetHelper.createWithFiles(FileHelper.createMany(3))

      const dataset = await datasetRepository.getByPersistentId(
        datasetResponse.persistentId,
        DRAFT_PARAM
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

    // TODO: Skipping, similar error, expecting 1 file but api returning 0
    it.skip('gets all the files by dataset persistentId when passing filterByType criteria', async () => {
      const datasetResponse = await DatasetHelper.createWithFiles([
        FileHelper.create('txt'),
        FileHelper.create('txt'),
        FileHelper.create('csv')
      ])

      const dataset = await datasetRepository.getByPersistentId(
        datasetResponse.persistentId,
        DRAFT_PARAM
      )

      if (!dataset) throw new Error('Dataset not found')

      await fileRepository
        .getAllByDatasetPersistentId(
          dataset.persistentId,
          dataset.version,
          new FilePaginationInfo(),
          new FileCriteria().withFilterByType('text/plain')
        )
        .then((files) => {
          expect(files.length).to.equal(2)
        })
    })

    it('gets all the files by dataset persistentId when passing filterByAccess criteria', async () => {
      const datasetResponse = await DatasetHelper.createWithFiles(FileHelper.createMany(3))
      if (!datasetResponse.files) throw new Error('Files not found')

      await FileHelper.restrict(datasetResponse.files[0].id)

      const dataset = await datasetRepository.getByPersistentId(
        datasetResponse.persistentId,
        DRAFT_PARAM
      )
      if (!dataset) throw new Error('Dataset not found')

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

      const category = { type: FileLabelType.CATEGORY, value: 'category' }
      await FileHelper.addLabel(datasetResponse.files[0].id, [category])

      const dataset = await datasetRepository.getByPersistentId(
        datasetResponse.persistentId,
        DRAFT_PARAM
      )
      if (!dataset) throw new Error('Dataset not found')

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
      const datasetResponse = await DatasetHelper.createWithFiles(FileHelper.createMany(3))

      const dataset = await datasetRepository.getByPersistentId(
        datasetResponse.persistentId,
        DRAFT_PARAM
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
    beforeEach(async () => {
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
      const dataset = await datasetRepository.getByPersistentId(datasetPersistentId, DRAFT_PARAM)
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
      const dataset = await datasetRepository.getByPersistentId(datasetPersistentId, DRAFT_PARAM)
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
      const datasetResponse = await DatasetHelper.createWithFiles(files)

      const dataset = await datasetRepository.getByPersistentId(
        datasetResponse.persistentId,
        DRAFT_PARAM
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
      const datasetResponse = await DatasetHelper.createWithFiles(files)

      const dataset = await datasetRepository.getByPersistentId(
        datasetResponse.persistentId,
        DRAFT_PARAM
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

      const expectedFile = fileExpectedData(datasetResponse.file.id, datasetResponse.persistentId)

      await fileRepository.getById(datasetResponse.file.id).then((file) => {
        expect(file.name).to.deep.equal(expectedFile.name)
        expect(file.ingest).to.deep.equal(expectedFile.ingest)
        expect(file.access).to.deep.equal(expectedFile.access)
        expect(file.permissions).to.deep.equal(expectedFile.permissions)
        expect(file.datasetVersion.number).to.deep.equal(expectedFile.datasetVersion.number)
        expect(file.datasetVersion.title).to.deep.equal(expectedFile.datasetVersion.title)
        expect(file.datasetVersion.publishingStatus).to.deep.equal(
          expectedFile.datasetVersion.publishingStatus
        )
        expect(file.datasetVersion.labels).to.deep.equal(expectedFile.datasetVersion.labels)
        expect(file.citation).to.match(expectedFileCitationRegex)
        compareMetadata(file.metadata, expectedFile.metadata)
      })
    })
  })
})
