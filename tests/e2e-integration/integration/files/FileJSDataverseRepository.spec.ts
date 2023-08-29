import { IntegrationTestsUtils } from '../IntegrationTestsUtils'
import { DatasetHelper } from '../datasets/DatasetHelper'
import { FileJSDataverseRepository } from '../../../../src/files/infrastructure/FileJSDataverseRepository'
import {
  File,
  FileDateType,
  FileSize,
  FileSizeUnit,
  FilePublishingStatus,
  FileType,
  FileLabelType,
  FileEmbargo
} from '../../../../src/files/domain/models/File'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { DatasetJSDataverseRepository } from '../../../../src/dataset/infrastructure/repositories/DatasetJSDataverseRepository'
import {
  DatasetPublishingStatus,
  DatasetVersion
} from '../../../../src/dataset/domain/models/Dataset'
import { FileHelper } from './FileHelper'

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
  {
    algorithm: 'MD5',
    value: '0187a54071542738aa47939e8218e5f2'
  }
)

describe('File JSDataverse Repository', () => {
  before(() => {
    IntegrationTestsUtils.setup()
  })
  beforeEach(() => {
    IntegrationTestsUtils.login()
  })

  describe('Get all files by dataset persistentId', () => {
    it('gets all the files by dataset persistentId with the basic information', async () => {
      const dataset = await DatasetHelper.createWithFiles(3).then((datasetResponse) =>
        datasetRepository.getByPersistentId(datasetResponse.persistentId)
      )
      if (!dataset) throw new Error('Dataset not found')

      await fileRepository
        .getAllByDatasetPersistentId(dataset.persistentId, dataset.version)
        .then((files) => {
          files.forEach((file, index) => {
            expect(file.name).to.deep.equal(`${expectedFile.name}${index > 0 ? `-${index}` : ''}`)
            expect(file.version).to.deep.equal(expectedFile.version)
            expect(file.access).to.deep.equal(expectedFile.access)
            expect(file.type).to.deep.equal(expectedFile.type)
            expect(file.size).to.deep.equal(expectedFile.size)
            expect(file.date).to.deep.equal(expectedFile.date)
            expect(file.downloadCount).to.deep.equal(expectedFile.downloadCount)
            expect(file.labels).to.deep.equal(expectedFile.labels)
            expect(file.checksum).to.deep.equal(expectedFile.checksum)
            expect(file.directory).to.deep.equal(expectedFile.directory)
          })
        })
    })

    it('gets all the files by dataset persistentId after dataset publication', async () => {
      const dataset = await DatasetHelper.createWithFiles(3).then((datasetResponse) =>
        datasetRepository.getByPersistentId(datasetResponse.persistentId)
      )
      if (!dataset) throw new Error('Dataset not found')

      await DatasetHelper.publish(dataset.persistentId)
      await IntegrationTestsUtils.wait(1500) // Wait for the dataset to be published

      await fileRepository
        .getAllByDatasetPersistentId(
          dataset.persistentId,
          new DatasetVersion(dataset.version.id, DatasetPublishingStatus.RELEASED, 1, 0)
        )
        .then((files) => {
          let expectedPublishedFile = expectedFile
          expectedPublishedFile.version.publishingStatus = FilePublishingStatus.RELEASED
          expectedPublishedFile.date.type = FileDateType.PUBLISHED

          files.forEach((file) => {
            expect(file.version).to.deep.equal(expectedPublishedFile.version)
            expect(file.date).to.deep.equal(expectedFile.date)
          })
        })
    })

    it.skip('gets all the files by dataset persistentId after dataset deaccession', async () => {
      const dataset = await DatasetHelper.createWithFiles(3).then((datasetResponse) =>
        datasetRepository.getByPersistentId(datasetResponse.persistentId)
      )
      if (!dataset) throw new Error('Dataset not found')

      await DatasetHelper.publish(dataset.persistentId)
      await IntegrationTestsUtils.wait(1500) // Wait for the dataset to be published

      DatasetHelper.deaccession(dataset.persistentId)
      await IntegrationTestsUtils.wait(1500) // Wait for the dataset to be deaccessioned
      await IntegrationTestsUtils.wait(1500) // Wait for the dataset to be deaccessioned
      await IntegrationTestsUtils.wait(1500) // Wait for the dataset to be deaccessioned

      // TODO - It always returns 404 when the dataset is deaccessioned, update the test when the issue is fixed
      fileRepository
        .getAllByDatasetPersistentId(
          dataset.persistentId,
          new DatasetVersion(dataset.version.id, DatasetPublishingStatus.DEACCESSIONED, 1, 0)
        )
        .then((files) => {
          const expectedDeaccessionedFile = expectedFile
          expectedDeaccessionedFile.version.publishingStatus = FilePublishingStatus.DEACCESSIONED

          files.forEach((file, index) => {
            expect(file.version).to.deep.equal(expectedDeaccessionedFile.version)
          })
        })
    })

    it('gets all the files by dataset persistentId after file has been downloaded', async () => {
      const datasetResponse = await DatasetHelper.createWithFiles(3)
      if (!datasetResponse.files) throw new Error('Files not found')

      await DatasetHelper.publish(datasetResponse.persistentId)
      await IntegrationTestsUtils.wait(1500) // Wait for the dataset to be published

      const dataset = await datasetRepository.getByPersistentId(datasetResponse.persistentId)
      if (!dataset) throw new Error('Dataset not found')

      await FileHelper.download(datasetResponse.files[0].id)
      await IntegrationTestsUtils.wait(1500) // Wait for the file to be downloaded

      await fileRepository
        .getAllByDatasetPersistentId(dataset.persistentId, dataset.version)
        .then((files) => {
          const expectedDownloadCount = 1
          expect(files[0].downloadCount).to.deep.equal(expectedDownloadCount)
        })
    })

    it('gets all the files by dataset persistentId after adding labels to the files', async () => {
      const datasetResponse = await DatasetHelper.createWithFiles(3)
      if (!datasetResponse.files) throw new Error('Files not found')

      const dataset = await datasetRepository.getByPersistentId(datasetResponse.persistentId)
      if (!dataset) throw new Error('Dataset not found')

      const expectedLabels = [
        { type: FileLabelType.CATEGORY, value: 'category' },
        { type: FileLabelType.CATEGORY, value: 'category_2' }
      ] // TODO - Ask how to add tabularTags to the file
      await FileHelper.addLabel(datasetResponse.files[0].id, expectedLabels)

      await fileRepository
        .getAllByDatasetPersistentId(dataset.persistentId, dataset.version)
        .then((files) => {
          expect(files[0].labels).to.deep.equal(expectedLabels)
        })
    })

    it.skip('gets all the files by dataset persistentId after adding a thumbnail to the files', async () => {
      // TODO - Do this in thumbnails issue https://github.com/IQSS/dataverse-frontend/issues/160
    })

    it('gets all the files by dataset persistentId after embargo', async () => {
      const datasetResponse = await DatasetHelper.createWithFiles(3)
      if (!datasetResponse.files) throw new Error('Files not found')

      const dataset = await datasetRepository.getByPersistentId(datasetResponse.persistentId)
      if (!dataset) throw new Error('Dataset not found')

      const embargoDate = '2100-10-20'
      await DatasetHelper.embargoFiles(
        datasetResponse.persistentId,
        [datasetResponse.files[0].id, datasetResponse.files[1].id, datasetResponse.files[2].id],
        embargoDate
      )

      await fileRepository
        .getAllByDatasetPersistentId(dataset.persistentId, dataset.version)
        .then((files) => {
          const expectedEmbargo = new FileEmbargo(new Date(embargoDate))
          expect(files[0].embargo).to.deep.equal(expectedEmbargo)
        })
    })

    it.skip('gets all the files by dataset persistentId when files are tabular data', async () => {
      // TODO - Implement this when isTabularData flag is added to js-dataverse response
      const datasetResponse = await DatasetHelper.createWithFiles(1, true)
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
  })
})
