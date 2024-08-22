import { TestsUtils } from '../../shared/TestsUtils'
import { FileJSDataverseRepository } from '../../../../src/files/infrastructure/FileJSDataverseRepository'
import { DatasetJSDataverseRepository } from '../../../../src/dataset/infrastructure/repositories/DatasetJSDataverseRepository'
import { DatasetHelper } from '../../shared/datasets/DatasetHelper'
import { FileHelper } from '../../shared/files/FileHelper'
import { DatasetNonNumericVersion } from '../../../../src/dataset/domain/models/Dataset'

const fileRepository = new FileJSDataverseRepository()
const datasetRepository = new DatasetJSDataverseRepository()

describe('DirectUpload', () => {
  before(() => {
    TestsUtils.setup()
  })

  beforeEach(() => {
    TestsUtils.login()
  })

  it('should upload file and add it to the dataset when there is only one destination URL', async () => {
    const dataset = await DatasetHelper.createWithFiles(FileHelper.createMany(3)).then(
      (datasetResponse) =>
        datasetRepository.getByPersistentId(
          datasetResponse.persistentId,
          DatasetNonNumericVersion.DRAFT
        )
    )
    if (!dataset) throw new Error('Dataset not found')
    const singlePartFile = FileHelper.createSinglePartFileBlob()

    await DatasetHelper.destroy(dataset.persistentId)
  })

  it('should upload file and add it to the dataset when there are multiple destination URLs', async () => {
    const dataset = await DatasetHelper.createWithFiles(FileHelper.createMany(3)).then(
      (datasetResponse) =>
        datasetRepository.getByPersistentId(
          datasetResponse.persistentId,
          DatasetNonNumericVersion.DRAFT
        )
    )
    if (!dataset) throw new Error('Dataset not found')
    const multipartFile = FileHelper.createMultipartFileBlob()

    await DatasetHelper.destroy(dataset.persistentId)
  })

  it('should not finish uploading file to destinations when user cancels immediately and there are multiple destination urls', async () => {
    const dataset = await DatasetHelper.createWithFiles(FileHelper.createMany(3)).then(
      (datasetResponse) =>
        datasetRepository.getByPersistentId(
          datasetResponse.persistentId,
          DatasetNonNumericVersion.DRAFT
        )
    )
    if (!dataset) throw new Error('Dataset not found')
    const multipartFile = FileHelper.createMultipartFileBlob()

    await DatasetHelper.destroy(dataset.persistentId)
  })
})
