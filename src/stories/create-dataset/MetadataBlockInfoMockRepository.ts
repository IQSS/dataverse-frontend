import { MetadataBlockInfoMother } from '../../../tests/component/metadata-block-info/domain/models/MetadataBlockInfoMother'
import {
  MetadataBlockInfo,
  MetadataBlockInfo2
} from '../../metadata-block-info/domain/models/MetadataBlockInfo'
import { MetadataBlockInfoRepository } from '../../metadata-block-info/domain/repositories/MetadataBlockInfoRepository'

export class MetadataBlockInfoMockRepository implements MetadataBlockInfoRepository {
  getByName(_name: string): Promise<MetadataBlockInfo | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MetadataBlockInfoMother.create())
      }, 1_000)
    })
  }

  getByColecctionId(
    _collectionId: number | string,
    onlyDisplayedOnCreate?: boolean
  ): Promise<MetadataBlockInfo2[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (onlyDisplayedOnCreate) {
          resolve(MetadataBlockInfoMother.getByCollectionIdDisplayedOnCreateTrue())
        } else {
          resolve(MetadataBlockInfoMother.getByCollectionIdDisplayedOnCreateFalse())
        }
      }, 1_000)
    })
  }
}
