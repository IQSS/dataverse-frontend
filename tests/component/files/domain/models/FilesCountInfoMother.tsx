import { FileType } from '../../../../../src/files/domain/models/FileMetadata'
import { faker } from '@faker-js/faker'
import { FilesCountInfo } from '../../../../../src/files/domain/models/FilesCountInfo'
import { FileAccessOption, FileTag } from '../../../../../src/files/domain/models/FileCriteria'
import FileTypeToFriendlyTypeMap from '../../../../../src/files/domain/models/FileTypeToFriendlyTypeMap'

export class FilesCountInfoMother {
  static create(props?: Partial<FilesCountInfo>): FilesCountInfo {
    const total = props?.total ?? faker.datatype.number()
    return {
      total: faker.datatype.number(),
      perFileType: [
        {
          type: new FileType(faker.helpers.arrayElement(Object.keys(FileTypeToFriendlyTypeMap))),
          count: faker.datatype.number({ max: total })
        },
        {
          type: new FileType(faker.helpers.arrayElement(Object.keys(FileTypeToFriendlyTypeMap))),
          count: faker.datatype.number({ max: total })
        }
      ],
      perAccess: [
        {
          access: faker.helpers.arrayElement(Object.values(FileAccessOption)),
          count: faker.datatype.number({ max: total })
        },
        {
          access: faker.helpers.arrayElement(Object.values(FileAccessOption)),
          count: faker.datatype.number({ max: total })
        }
      ],
      perFileTag: [
        {
          tag: new FileTag(faker.lorem.word()),
          count: faker.datatype.number({ max: total })
        },
        {
          tag: new FileTag(faker.lorem.word()),
          count: faker.datatype.number({ max: total })
        }
      ],
      ...props
    }
  }

  static createEmpty(): FilesCountInfo {
    return {
      total: 0,
      perFileType: [],
      perAccess: [],
      perFileTag: []
    }
  }

  static createOnlyTotal(): FilesCountInfo {
    return {
      total: faker.datatype.number(),
      perFileType: [],
      perAccess: [],
      perFileTag: []
    }
  }
}
