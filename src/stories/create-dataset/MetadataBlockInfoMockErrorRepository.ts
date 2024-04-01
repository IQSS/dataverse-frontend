import {
  MetadataBlockInfo,
  MetadataBlockInfo2
} from '../../metadata-block-info/domain/models/MetadataBlockInfo'
import { MetadataBlockInfoMockRepository } from './MetadataBlockInfoMockRepository'

export class MetadataBlockInfoMockErrorRepository implements MetadataBlockInfoMockRepository {
  getByName(_name: string): Promise<MetadataBlockInfo | undefined> {
    return new Promise((_resolve, reject) => {
      setTimeout(() => {
        reject('Error thrown from mock')
      }, 1000)
    })
  }

  getByColecctionId(_collectionId: string, _create: boolean): Promise<MetadataBlockInfo2[]> {
    return new Promise((_resolve, reject) => {
      setTimeout(() => {
        reject('Error thrown from mock')
      }, 1000)
    })
  }
}
