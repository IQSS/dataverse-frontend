import { FileType } from '../../../../../src/files/domain/models/File'
import { faker } from '@faker-js/faker'
import { FilesCountInfo } from '../../../../../src/files/domain/models/FilesCountInfo'
import { FileAccessOption } from '../../../../../src/files/domain/models/FileCriteria'

export class FilesCountInfoMother {
  static create(props?: Partial<FilesCountInfo>): FilesCountInfo {
    return {
      total: faker.datatype.number(),
      perFileType: [
        {
          type: new FileType(faker.system.fileType()),
          count: faker.datatype.number()
        },
        {
          type: new FileType(faker.system.fileType()),
          count: faker.datatype.number()
        }
      ],
      perAccess: [
        {
          access: faker.helpers.arrayElement(Object.values(FileAccessOption)),
          count: faker.datatype.number()
        },
        {
          access: faker.helpers.arrayElement(Object.values(FileAccessOption)),
          count: faker.datatype.number()
        }
      ],
      ...props
    }
  }
}
