import { FileType } from '../../../../../src/files/domain/models/File'
import { faker } from '@faker-js/faker'
import { FilesCountInfo } from '../../../../../src/files/domain/models/FilesCountInfo'

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
      ...props
    }
  }
}
