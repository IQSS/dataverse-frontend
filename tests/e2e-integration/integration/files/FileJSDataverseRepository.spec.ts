import { IntegrationTestsUtils } from '../IntegrationTestsUtils'
import { DatasetHelper } from '../datasets/DatasetHelper'
import { FileJSDataverseRepository } from '../../../../src/files/infrastructure/FileJSDataverseRepository'
import {
  File,
  FileDateType,
  FileSize,
  FileSizeUnit,
  FilePublishingStatus,
  FileType
} from '../../../../src/files/domain/models/File'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)
const expect = chai.expect

const fileRepository = new FileJSDataverseRepository()
const expectedFile = new File(
  1,
  { number: 1, publishingStatus: FilePublishingStatus.DRAFT },
  'blob',
  {
    restricted: false,
    latestVersionRestricted: false,
    canBeRequested: true,
    requested: false
  },
  new FileType('text/plain'),
  new FileSize(25, FileSizeUnit.BYTES),
  { type: FileDateType.DEPOSITED, date: new Date().toDateString() },
  0,
  []
)

describe('File JSDataverse Repository', () => {
  before(() => {
    IntegrationTestsUtils.setup()
  })
  beforeEach(() => IntegrationTestsUtils.login())

  it('gets all the files by dataset persistentId with the basic information', async () => {
    const datasetResponse = await DatasetHelper.createWithFiles(3)

    await fileRepository.getAllByDatasetPersistentId(datasetResponse.persistentId).then((files) => {
      files.forEach((file, index) => {
        expect(file.name).to.deep.equal(`${expectedFile.name}${index > 0 ? `-${index}` : ''}`)
        expect(file.version).to.deep.equal(expectedFile.version)
        expect(file.access).to.deep.equal(expectedFile.access)
        expect(file.type).to.deep.equal(expectedFile.type)
        expect(file.size).to.deep.equal(expectedFile.size)
        expect(file.date).to.deep.equal(expectedFile.date)
        expect(file.downloads).to.deep.equal(expectedFile.downloads)
        expect(file.labels).to.deep.equal(expectedFile.labels)
      })
    })
  })
})
