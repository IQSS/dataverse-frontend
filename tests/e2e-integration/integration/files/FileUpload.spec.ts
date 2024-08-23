import { TestsUtils } from '../../shared/TestsUtils'
import { FileJSDataverseRepository } from '../../../../src/files/infrastructure/FileJSDataverseRepository'
import { DatasetJSDataverseRepository } from '../../../../src/dataset/infrastructure/repositories/DatasetJSDataverseRepository'
import { DatasetHelper } from '../../shared/datasets/DatasetHelper'
import { FileHelper } from '../../shared/files/FileHelper'
import { DatasetNonNumericVersion } from '../../../../src/dataset/domain/models/Dataset'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)
const expect = chai.expect

const fileRepository = new FileJSDataverseRepository()
const datasetRepository = new DatasetJSDataverseRepository()

describe('DirectUpload', () => {
  before(() => {
    TestsUtils.setup()
  })

  beforeEach(() => {
    TestsUtils.login()
  })

  it('should upload file and add it to the dataset', async () => {
    const dataset = await DatasetHelper.create().then((datasetResponse) =>
      datasetRepository.getByPersistentId(
        datasetResponse.persistentId,
        DatasetNonNumericVersion.DRAFT
      )
    )
    if (!dataset) throw new Error('Dataset not found')

    const singlePartFile = FileHelper.createSinglePartFileBlob()
    const controller = new AbortController()
    let storageId: string | undefined = undefined

    await fileRepository.uploadFile(
      dataset.persistentId,
      { file: singlePartFile },
      () => {},
      controller,
      (sId) => {
        storageId = sId
      }
    )

    expect(storageId).to.be.not.undefined

    await fileRepository.addUploadedFiles(dataset.persistentId, [
      {
        progress: 100,
        progressHidden: false,
        fileSizeString: '1000 B',
        fileSize: 1000,
        fileLastModified: 0,
        failed: false,
        done: true,
        removed: false,
        fileName: 'test.json',
        fileDir: '',
        fileType: 'application/json',
        key: 'test.json',
        tags: ['tag'],
        restricted: false,
        storageId: storageId,
        checksumValue: 'abc123'
      }
    ])

    const files = await fileRepository.getAllByDatasetPersistentId(
      dataset.persistentId,
      dataset.version
    )
    expect(files).to.be.not.empty
    expect(files[0].name).to.be.equal('test.json')

    await DatasetHelper.destroy(dataset.persistentId)
  })

  it('should upload 2 files and add it to the dataset', async () => {
    const dataset = await DatasetHelper.create().then((datasetResponse) =>
      datasetRepository.getByPersistentId(
        datasetResponse.persistentId,
        DatasetNonNumericVersion.DRAFT
      )
    )
    if (!dataset) throw new Error('Dataset not found')

    const singlePartFile1 = FileHelper.createSinglePartFileBlob()
    const singlePartFile2 = FileHelper.createSinglePartFileBlob()
    let storageId1: string | undefined = undefined
    let storageId2: string | undefined = undefined

    const upload1 = fileRepository.uploadFile(
      dataset.persistentId,
      { file: singlePartFile1 },
      () => {},
      new AbortController(),
      (sId) => {
        storageId1 = sId
      }
    )

    const upload2 = fileRepository.uploadFile(
      dataset.persistentId,
      { file: singlePartFile2 },
      () => {},
      new AbortController(),
      (sId) => {
        storageId2 = sId
      }
    )

    await upload1
    await upload2

    expect(storageId1).to.be.not.undefined
    expect(storageId2).to.be.not.undefined

    await fileRepository.addUploadedFiles(dataset.persistentId, [
      {
        progress: 100,
        progressHidden: false,
        fileSizeString: '1000 B',
        fileSize: 1000,
        fileLastModified: 0,
        failed: false,
        done: true,
        removed: false,
        fileName: 'test1.json',
        fileDir: '',
        fileType: 'application/json',
        key: 'test1.json',
        tags: ['tag'],
        restricted: false,
        storageId: storageId1,
        checksumValue: 'abc123'
      },
      {
        progress: 100,
        progressHidden: false,
        fileSizeString: '1000 B',
        fileSize: 1000,
        fileLastModified: 0,
        failed: false,
        done: true,
        removed: false,
        fileName: 'test2.json',
        fileDir: '',
        fileType: 'application/json',
        key: 'test2.json',
        tags: ['tag'],
        restricted: false,
        storageId: storageId2,
        checksumValue: 'def456'
      }
    ])

    const files = await fileRepository.getAllByDatasetPersistentId(
      dataset.persistentId,
      dataset.version
    )
    expect(files).to.be.not.empty
    expect(files[0].name).to.be.equal('test1.json')
    expect(files[1].name).to.be.equal('test2.json')

    await DatasetHelper.destroy(dataset.persistentId)
  })

  it('should not finish uploading file to destinations when user cancels immediately', async () => {
    const dataset = await DatasetHelper.create().then((datasetResponse) =>
      datasetRepository.getByPersistentId(
        datasetResponse.persistentId,
        DatasetNonNumericVersion.DRAFT
      )
    )
    if (!dataset) throw new Error('Dataset not found')

    const multipartFile = FileHelper.createMultipartFileBlob()
    const controller = new AbortController()

    const upload = fileRepository.uploadFile(
      dataset.persistentId,
      { file: multipartFile },
      () => {},
      controller,
      () => {}
    )
    controller.abort()
    await upload
      .then(() => {
        throw new Error('upload succeeded')
      })
      .catch(() => {})

    await DatasetHelper.destroy(dataset.persistentId)
  })
})
