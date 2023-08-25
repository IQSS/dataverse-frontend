import {
  File,
  FileDateType,
  FilePublishingStatus,
  FileSize,
  FileSizeUnit,
  FileType,
  FileVersion
} from '../../domain/models/File'
import { File as JSFile } from '@iqss/dataverse-client-javascript'

export class JSFileMapper {
  static toFile(jsFile: JSFile): File {
    console.log(jsFile)
    return new File(
      jsFile.id,
      this.toFileVersion(jsFile.version, jsFile.publicationDate),
      jsFile.name,
      {
        restricted: false,
        latestVersionRestricted: false,
        canBeRequested: true,
        requested: true
      },
      new FileType('text/plain'),
      new FileSize(25, FileSizeUnit.BYTES),
      { type: FileDateType.DEPOSITED, date: 'Thu Aug 24 2023' },
      0,
      []
    )
  }

  static toFileVersion(jsVersion: number, jsPublicationDate?: Date): FileVersion {
    return {
      number: jsVersion,
      publishingStatus: jsPublicationDate
        ? FilePublishingStatus.RELEASED
        : FilePublishingStatus.DRAFT
    }
  }
}
