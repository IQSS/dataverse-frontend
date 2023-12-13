import { File } from '../../../../../src/files/domain/models/File'
import { faker } from '@faker-js/faker'

export class FileMother {
  static create(props?: Partial<File>): File {
    return {
      name: faker.system.fileName(),
      datasetTitle: faker.lorem.words(3),
      ...props
    }
  }

  static createRealistic(props?: Partial<File>): File {
    return this.create({
      name: 'file.csv',
      datasetTitle: 'Dataset title',
      ...props
    })
  }
}
