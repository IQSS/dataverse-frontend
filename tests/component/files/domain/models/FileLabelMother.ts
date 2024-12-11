import { faker } from '@faker-js/faker'
import { FileLabel, FileLabelType } from '@/files/domain/models/FileMetadata'

export class FileLabelMother {
  static create(props?: Partial<FileLabel>): FileLabel {
    return {
      type: props?.type ?? FileLabelType.CATEGORY,
      value: props?.value ?? faker.lorem.word()
    }
  }
}
