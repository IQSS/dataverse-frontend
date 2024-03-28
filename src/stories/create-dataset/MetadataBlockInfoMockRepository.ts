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

  getByColecctionId(_collectionId: string, _create: boolean): Promise<MetadataBlockInfo2[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MetadataBlockInfoMother.getByCollectionIdFullResponse())
      }, 1_000)
    })
  }
}
