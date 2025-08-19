import { Dataset, DatasetLock } from '../../dataset/domain/models/Dataset'
import { DatasetVersionDiff } from '../../dataset/domain/models/DatasetVersionDiff'
import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { DatasetMother } from '../../../tests/component/dataset/domain/models/DatasetMother'
import { DatasetPaginationInfo } from '../../dataset/domain/models/DatasetPaginationInfo'
import { DatasetItemTypePreviewMother } from '../../../tests/component/dataset/domain/models/DatasetItemTypePreviewMother'
import { DatasetVersionDiffMother } from '../../../tests/component/dataset/domain/models/DatasetVersionDiffMother'
import { DatasetVersionsSummariesMother } from '../../../tests/component/dataset/domain/models/DatasetVersionsSummariesMother'
import { DatasetDTO } from '../../dataset/domain/useCases/DTOs/DatasetDTO'
import { DatasetsWithCount } from '../../dataset/domain/models/DatasetsWithCount'
import { FakerHelper } from '../../../tests/component/shared/FakerHelper'
import { VersionUpdateType } from '../../dataset/domain/models/VersionUpdateType'
import { DatasetVersionSummaryInfo } from '@/dataset/domain/models/DatasetVersionSummaryInfo'
import { DatasetDeaccessionDTO } from '@iqss/dataverse-client-javascript'
import { DatasetDownloadCount } from '@/dataset/domain/models/DatasetDownloadCount'
import { DatasetDownloadCountMother } from '@tests/component/dataset/domain/models/DatasetDownloadCountMother'
import { CitationFormat, FormattedCitation } from '@/dataset/domain/models/DatasetCitation'

export class DatasetMockRepository implements DatasetRepository {
  getAllWithCount: (
    collectionId: string,
    paginationInfo: DatasetPaginationInfo
  ) => Promise<DatasetsWithCount> = (
    _collectionId: string,
    paginationInfo: DatasetPaginationInfo
  ) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          datasetPreviews: DatasetItemTypePreviewMother.createManyRealistic(
            paginationInfo.pageSize
          ),
          totalCount: 200
        })
      }, FakerHelper.loadingTimout())
    })
  }

  getByPersistentId(
    _persistentId: string,
    _version?: string | undefined
  ): Promise<Dataset | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(DatasetMother.createRealistic())
      }, FakerHelper.loadingTimout())
    })
  }
  getByPrivateUrlToken(_privateUrlToken: string): Promise<Dataset | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(DatasetMother.createRealistic())
      }, FakerHelper.loadingTimout())
    })
  }
  getVersionDiff(
    _persistentId: string,
    _oldVersion: string,
    _newVersion: string
  ): Promise<DatasetVersionDiff> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(DatasetVersionDiffMother.create())
      }, FakerHelper.loadingTimout())
    })
  }
  create(_dataset: DatasetDTO): Promise<{ persistentId: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ persistentId: 'some-persistent-id' })
      }, FakerHelper.loadingTimout())
    })
  }
  publish(_persistentId: string, _versionUpdateType: VersionUpdateType): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, FakerHelper.loadingTimout())
    })
  }
  getLocks(_persistentId: string): Promise<DatasetLock[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([])
      }, FakerHelper.loadingTimout())
    })
  }

  updateMetadata(_datasetId: string | number, _updatedDataset: DatasetDTO): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, FakerHelper.loadingTimout())
    })
  }

  getDatasetVersionsSummaries(_datasetId: number | string): Promise<DatasetVersionSummaryInfo[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(DatasetVersionsSummariesMother.create())
      }, FakerHelper.loadingTimout())
    })
  }

  deaccession(
    _datasetId: string | number,
    _version: string,
    _datasetDeaccessionDTO: DatasetDeaccessionDTO
  ): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, FakerHelper.loadingTimout())
    })
  }

  getDownloadCount(
    _datasetId: string | number,
    includeMDC?: boolean
  ): Promise<DatasetDownloadCount> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          includeMDC
            ? DatasetDownloadCountMother.createWithMDCStartDate()
            : DatasetDownloadCountMother.createWithoutMDCStartDate()
        )
      }, FakerHelper.loadingTimout())
    })
  }
  getAvailableCategories(_datasetId: string | number): Promise<string[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(['Category 1', 'Category 2', 'Category 3'])
      }, FakerHelper.loadingTimout())
    })
  }

  deleteDatasetDraft(_datasetId: string | number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, FakerHelper.loadingTimout())
    })
  }
  getDatasetCitationInOtherFormats: (
    datasetId: string | number,
    version: string,
    format: CitationFormat
  ) => Promise<FormattedCitation> = (
    _datasetId: string | number,
    _version: string,
    _format: CitationFormat
  ) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          content: 'Formatted citation content',
          contentType: 'text/plain'
        })
      }, FakerHelper.loadingTimout())
    })
  }
}
