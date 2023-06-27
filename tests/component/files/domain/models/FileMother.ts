import { faker } from '@faker-js/faker'
import { File, FileSize, FileVersion } from '../../../../../src/files/domain/models/File'

const fileSizeUnits = ['B', 'KB', 'MB', 'GB']

const imageOrUndefined: () => string | undefined = () => {
  const shouldGenerateImage = faker.datatype.boolean()
  return shouldGenerateImage ? faker.image.imageUrl() : undefined
}

export class FileMother {
  static create(props?: Partial<File>): File {
    const fileMockedData = {
      id: faker.datatype.uuid(),
      name: faker.system.fileName(),
      access: { restricted: faker.datatype.boolean(), canDownload: faker.datatype.boolean() },
      version: { majorNumber: faker.datatype.number(), minorNumber: faker.datatype.number() },
      type: faker.system.fileType(),
      size: {
        value: faker.datatype.number({ max: 1024, precision: 2 }),
        unit: faker.helpers.arrayElement(fileSizeUnits)
      },
      publicationDate: faker.date.recent().toISOString(),
      downloads: faker.datatype.number(40),
      checksum: faker.datatype.uuid(),
      thumbnail: imageOrUndefined(),
      ...props
    }

    return new File(
      fileMockedData.id,
      new FileVersion(fileMockedData.version.majorNumber, fileMockedData.version.minorNumber),
      fileMockedData.name,
      fileMockedData.access,
      fileMockedData.type,
      new FileSize(fileMockedData.size.value, fileMockedData.size.unit),
      fileMockedData.publicationDate,
      fileMockedData.downloads,
      fileMockedData.checksum,
      fileMockedData.thumbnail
    )
  }
}
