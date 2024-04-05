import {
  MetadataBlockInfo,
  MetadataBlockInfo2
} from '../../metadata-block-info/domain/models/MetadataBlockInfo'
import { MetadataBlockInfoMockRepository } from './MetadataBlockInfoMockRepository'

export class MetadataBlockInfoMockLoadingRepository implements MetadataBlockInfoMockRepository {
  getByName(_name: string): Promise<MetadataBlockInfo | undefined> {
    return new Promise(() => {})
  }

  getByColecctionId(
    _collectionId: number | string,
    _onlyDisplayedOnCreate?: boolean
  ): Promise<MetadataBlockInfo2[]> {
    return new Promise(() => {})
  }
}
