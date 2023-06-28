import { faker } from '@faker-js/faker'
import {
  File,
  FileDateType,
  FileEmbargo,
  FileLabel,
  FileLabelType,
  FileSize,
  FileSizeUnit,
  FileStatus,
  FileVersion
} from '../../../../../src/files/domain/models/File'

const valueOrUndefined: <T>(value: T) => T | undefined = (value) => {
  const shouldShowValue = faker.datatype.boolean()
  return shouldShowValue ? value : undefined
}

const createFakeFileLabel = (): FileLabel => ({
  type: faker.helpers.arrayElement(Object.values(FileLabelType)),
  value: faker.lorem.word()
})

export class FileMother {
  static create(props?: Partial<File>): File {
    const fileType = faker.helpers.arrayElement(['tabular data', faker.system.fileType()])
    const checksum = valueOrUndefined<string>(faker.datatype.uuid())
    const fileMockedData = {
      id: faker.datatype.uuid(),
      name: faker.system.fileName(),
      access: { restricted: faker.datatype.boolean(), canDownload: faker.datatype.boolean() },
      version: {
        majorNumber: faker.datatype.number(),
        minorNumber: faker.datatype.number(),
        status: faker.helpers.arrayElement(Object.values(FileStatus))
      },
      type: fileType,
      size: {
        value: faker.datatype.number({ max: 1024, precision: 2 }),
        unit: faker.helpers.arrayElement(Object.values(FileSizeUnit))
      },
      date: {
        type: faker.helpers.arrayElement(Object.values(FileDateType)),
        date: faker.date.recent().toDateString()
      },
      downloads: faker.datatype.number(40),
      labels: faker.datatype.boolean()
        ? faker.helpers.arrayElements<FileLabel>([
            createFakeFileLabel(),
            createFakeFileLabel(),
            createFakeFileLabel(),
            createFakeFileLabel()
          ])
        : [],
      checksum: checksum,
      thumbnail: valueOrUndefined<string>(faker.image.imageUrl()),
      directory: valueOrUndefined<string>(faker.system.directoryPath()),
      embargo: valueOrUndefined<FileEmbargo>({
        active: faker.datatype.boolean(),
        date: faker.date.recent().toDateString()
      }),
      tabularData:
        fileType === 'tabular data' && !checksum
          ? {
              variablesCount: faker.datatype.number(100),
              observationsCount: faker.datatype.number(100),
              unf: `UNF:${faker.datatype.uuid()}==`
            }
          : undefined,
      description: valueOrUndefined<string>(faker.lorem.paragraph()),
      ...props
    }

    return new File(
      fileMockedData.id,
      new FileVersion(
        fileMockedData.version.majorNumber,
        fileMockedData.version.minorNumber,
        fileMockedData.version.status
      ),
      fileMockedData.name,
      fileMockedData.access,
      fileMockedData.type,
      new FileSize(fileMockedData.size.value, fileMockedData.size.unit),
      fileMockedData.date,
      fileMockedData.downloads,
      fileMockedData.labels,
      fileMockedData.checksum,
      fileMockedData.thumbnail,
      fileMockedData.directory,
      fileMockedData.embargo,
      fileMockedData.tabularData,
      fileMockedData.description
    )
  }
}
