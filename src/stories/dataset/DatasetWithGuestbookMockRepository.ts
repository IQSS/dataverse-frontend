import { Dataset } from '@/dataset/domain/models/Dataset'
import { DatasetMockRepository } from './DatasetMockRepository'
import {
  DatasetMother,
  DatasetPermissionsMother
} from '@tests/component/dataset/domain/models/DatasetMother'
import { storybookGuestbook } from '../shared-mock-repositories/guestbook/GuestbookMockRepository'

export class DatasetWithGuestbookMockRepository extends DatasetMockRepository {
  getByPersistentId(
    persistentId: string,
    _version?: string | undefined
  ): Promise<Dataset | undefined> {
    return Promise.resolve(
      DatasetMother.createRealistic({
        persistentId,
        guestbookId: storybookGuestbook.id,
        permissions: DatasetPermissionsMother.createWithFilesDownloadAllowed()
      })
    )
  }

  getByPrivateUrlToken(_privateUrlToken: string): Promise<Dataset | undefined> {
    return Promise.resolve(
      DatasetMother.createRealistic({
        guestbookId: storybookGuestbook.id,
        permissions: DatasetPermissionsMother.createWithFilesDownloadAllowed()
      })
    )
  }
}
