import { faker } from '@faker-js/faker'
import { CollectionItemType } from '@/collection/domain/models/CollectionItemType'
import { FileItemTypePreview } from '@/files/domain/models/FileItemTypePreview'
import { PublicationStatus } from '@/shared/core/domain/models/PublicationStatus'
import { FakerHelper } from '../../../shared/FakerHelper'

export class FileItemTypePreviewMother {
  static create(props?: Partial<FileItemTypePreview>): FileItemTypePreview {
    return {
      type: CollectionItemType.FILE,
      id: faker.datatype.number(),
      name: faker.lorem.words(3),
      persistentId: faker.datatype.uuid(),
      url: faker.internet.url(),
      thumbnail: FakerHelper.getImageUrl(),
      description: faker.lorem.paragraph(),
      fileType: faker.system.fileType(),
      fileContentType: faker.system.mimeType(),
      sizeInBytes: faker.datatype.number(),
      md5: faker.datatype.uuid(),
      checksum: {
        type: faker.lorem.word(),
        value: faker.datatype.uuid()
      },
      unf: faker.datatype.uuid(),
      datasetName: faker.lorem.words(3),
      datasetId: faker.datatype.number(),
      datasetPersistentId: faker.datatype.uuid(),
      datasetCitation: faker.lorem.paragraph(),
      publicationStatuses: [PublicationStatus.Published],
      releaseOrCreateDate: faker.date.past(),
      ...props
    }
  }

  static createMany(amount: number, props?: Partial<FileItemTypePreview>): FileItemTypePreview[] {
    return Array.from({ length: amount }).map(() => this.create(props))
  }

  static createRealistic(props?: Partial<FileItemTypePreview>): FileItemTypePreview {
    return this.create({
      id: 2,
      name: 'test file',
      persistentId: 'test pid2',
      url: 'http://dataverse.com',
      thumbnail: 'http://dataverseimage.com',
      description: 'test description',
      fileType: 'testtype',
      fileContentType: 'test/type',
      sizeInBytes: 10,
      md5: 'testmd5',
      checksum: {
        type: 'md5',
        value: 'testmd5'
      },
      unf: 'testunf',
      datasetName: 'test dataset',
      datasetId: 1,
      datasetPersistentId: 'test pid1',
      datasetCitation: 'test citation',
      publicationStatuses: [PublicationStatus.Published],
      releaseOrCreateDate: new Date('2023-05-15T08:21:01Z'),
      ...props
    })
  }

  static createWithDraft(): FileItemTypePreview {
    return this.create({
      publicationStatuses: [PublicationStatus.Draft]
    })
  }

  static createUnpublishedWithDraft(): FileItemTypePreview {
    return this.create({
      publicationStatuses: [PublicationStatus.Draft, PublicationStatus.Unpublished]
    })
  }
}
