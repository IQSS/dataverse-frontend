import { MetadataBlockInfoMother } from '../../../../tests/component/metadata-block-info/domain/models/MetadataBlockInfoMother'
import {
  MetadataBlockInfoDisplayFormat,
  MetadataBlockInfo
} from '../../../metadata-block-info/domain/models/MetadataBlockInfo'
import { MetadataBlockInfoRepository } from '../../../metadata-block-info/domain/repositories/MetadataBlockInfoRepository'

export class MetadataBlockInfoMockRepository implements MetadataBlockInfoRepository {
  getByName(_name: string): Promise<MetadataBlockInfoDisplayFormat | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MetadataBlockInfoMother.create())
      }, 1_000)
    })
  }

  getByColecctionId(_collectionId: number | string): Promise<MetadataBlockInfo[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MetadataBlockInfoMother.getByCollectionIdDisplayedOnCreateFalse())
      }, 1_000)
    })
  }

  getDisplayedOnCreateByCollectionId(_collectionId: number | string): Promise<MetadataBlockInfo[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MetadataBlockInfoMother.getByCollectionIdDisplayedOnCreateTrue())
      }, 1_000)
    })
  }
}
