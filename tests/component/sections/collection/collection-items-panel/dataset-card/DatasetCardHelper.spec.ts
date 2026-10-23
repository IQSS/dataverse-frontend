import { DatasetCardHelper } from '@/sections/collection/collection-items-panel/items-list/dataset-card/DatasetCardHelper'
import {
  DatasetNonNumericVersion,
  DatasetNonNumericVersionSearchParam,
  DatasetPublishingStatus
} from '@/dataset/domain/models/Dataset'

describe('DatasetCardHelper.getDatasetSearchParams', () => {
  const PID = 'doi:10.5072/FK2/TEST'

  it('returns just the persistentId when no version is provided and the status is RELEASED', () => {
    const params = DatasetCardHelper.getDatasetSearchParams(PID, DatasetPublishingStatus.RELEASED)
    expect(params).to.deep.equal({ persistentId: PID })
  })

  it('echoes the supplied versionNumber when one is provided and the status is RELEASED', () => {
    const params = DatasetCardHelper.getDatasetSearchParams(
      PID,
      DatasetPublishingStatus.RELEASED,
      '2.0'
    )
    expect(params).to.deep.equal({ persistentId: PID, version: '2.0' })
  })

  it('rewrites version to LATEST_PUBLISHED when versionNumber is DRAFT but the dataset is DEACCESSIONED', () => {
    const params = DatasetCardHelper.getDatasetSearchParams(
      PID,
      DatasetPublishingStatus.DEACCESSIONED,
      DatasetNonNumericVersion.DRAFT
    )
    expect(params).to.deep.equal({
      persistentId: PID,
      version: DatasetNonNumericVersion.LATEST_PUBLISHED
    })
  })

  it('rewrites version to the search-param DRAFT sentinel when publishingStatus is DRAFT', () => {
    const params = DatasetCardHelper.getDatasetSearchParams(
      PID,
      DatasetPublishingStatus.DRAFT,
      '1.0'
    )
    expect(params).to.deep.equal({
      persistentId: PID,
      version: DatasetNonNumericVersionSearchParam.DRAFT
    })
  })

  it('does not rewrite version to LATEST_PUBLISHED when versionNumber is DRAFT but the dataset is not DEACCESSIONED', () => {
    const params = DatasetCardHelper.getDatasetSearchParams(
      PID,
      DatasetPublishingStatus.RELEASED,
      DatasetNonNumericVersion.DRAFT
    )
    expect(params).to.deep.equal({
      persistentId: PID,
      version: DatasetNonNumericVersion.DRAFT
    })
  })
})
