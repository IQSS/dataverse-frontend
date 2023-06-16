import { faker } from '@faker-js/faker'
import { File } from '../../files/domain/models/File'

const range = (len: number) => {
  const arr = []
  for (let i = 0; i < len; i++) {
    arr.push(i)
  }
  return arr
}

const newFile = (): File => {
  return {
    name: faker.system.fileName(),
    link: faker.internet.url(),
    thumbnail: faker.image.imageUrl(),
    type: faker.system.fileType(),
    size: faker.datatype.number(40),
    publicationDate: faker.date.recent().toISOString(),
    downloads: faker.datatype.number(40),
    checksum: faker.datatype.uuid()
  }
}

export function makeFiles(len: number): File[] {
  return range(len).map(() => {
    return {
      ...newFile()
    }
  })
}

export const FilesMockData = (): File[] => makeFiles(100)
